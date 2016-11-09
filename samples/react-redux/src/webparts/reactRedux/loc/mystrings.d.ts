declare interface IReactReduxStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  NameFieldLabel: string;
  EndpointFieldLabel: string;
}

declare module 'reactReduxStrings' {
  const strings: IReactReduxStrings;
  export = strings;
}
