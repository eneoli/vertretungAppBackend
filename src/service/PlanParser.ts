import cheerio from 'cheerio';

interface TableCells {
    hour: string;
    class: string;
    subject: string;
    teacher: string;
    replacement: string;
    room: string;
    comment: string;
}

interface ProcessedTable {
    date: Date;
    state: Date;
    usedTeachers: string;
    missingTeachers: string;
    lessons: TableCells[];
}

interface TableEntry {
    hour: string,
    class: string,
    subject: string,
    teacher: string,
    replacement: string,
    room: string,
    comment: string,
}

export class PlanParser {
    private fetchTextByClass(html: CheerioStatic, classSelector: string) {
        return html(classSelector).first().text();
    }

    private convertDate(dateString: string) {
        const splitted = dateString.split(' ');

        const day = parseInt(splitted[0].replace('.', ''), 10);

        let month = -1;

        switch (splitted[1].toUpperCase()) {
            case 'JANUAR':
                month = 0;
                break;
            case 'FEBRUAR':
                month = 1;
                break;
            case 'MÄRZ':
                month = 2;
                break;
            case 'APRIL':
                month = 3;
                break;
            case 'MAI':
                month = 4;
                break;
            case 'JUNI':
                month = 5;
                break;
            case 'JULI':
                month = 6;
                break;
            case 'AUGUST':
                month = 7;
                break;
            case 'SEPTEMBER':
                month = 8;
                break;
            case 'OKTOBER':
                month = 9;
                break;
            case 'NOVEMBER':
                month = 10;
                break;
            case 'DEZEMBER':
                month = 11;
                break;
        }

        const year = splitted[2];

        const date = new Date();
        date.setDate(day);
        date.setMonth(month);
        date.setFullYear(parseInt(year, 10));

        return date;
    }

    private convertDate2(date: string, time: string) {
        const splittedDate = date.split('.');
        const splittedTime = time.split(':');

        const tmpDate = new Date();
        tmpDate.setDate(parseInt(splittedDate[0], 10));
        tmpDate.setMonth(parseInt(splittedDate[1], 10) - 1);
        tmpDate.setFullYear(parseInt(splittedDate[2], 10));

        tmpDate.setHours(parseInt(splittedTime[0], 10));
        tmpDate.setMinutes(parseInt(splittedTime[1], 10));

        return tmpDate;
    }

    private processTable(day: CheerioStatic): TableCells[] {
        const tables: TableEntry[] = [];

        const table = day('table').first();
        const rows = table.find('tr').slice(1);

        rows.each((_, r) => {
            const tmpTable: TableEntry = {} as TableEntry;
            const tds = cheerio(r).children();
            tmpTable.hour = tds.eq(0).text().trim();
            tmpTable.class = tds.eq(1).text().trim();
            tmpTable.subject = tds.eq(2).text().trim();
            tmpTable.teacher = tds.eq(3).text().trim();
            tmpTable.replacement = tds.eq(4).text().trim();
            tmpTable.room = tds.eq(5).text().trim();
            tmpTable.comment = tds.eq(6).text().trim();
            tables.push(tmpTable);
        });

        return tables;
    }


    public parse(html: string): ProcessedTable {
        const site = cheerio.load(html);

        return {
            date: this.convertDate(this.fetchTextByClass(site, '.Titel')
                .split(',')[1].replace('�', 'ä').substr(1)),
            state: this.convertDate2(this.fetchTextByClass(site, '.Stand')
                .match(/\d{2}[./-]\d{2}[./-]\d{4}/)![0], this.fetchTextByClass(site, '.Stand')
                .match(/([01]?[0-9]|2[0-3]):[0-5][0-9]/)![0]),
            missingTeachers: this.fetchTextByClass(site, '.Abwesenheiten-Lehrer')
                .replace('\n', '').replace('\n', '').replace('�', 'ü'),
            usedTeachers: this.fetchTextByClass(site, '.LehrerVerplant')
                .replace('\n', ''),
            lessons: this.processTable(site),
        }
    }
}