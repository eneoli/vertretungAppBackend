import {ServiceFactory} from "./service-factory";

export interface ServiceDescriptor<T> {
  factory?: ServiceFactory<T>;
  instance?: T;
  constructor?: { new(): T };
}