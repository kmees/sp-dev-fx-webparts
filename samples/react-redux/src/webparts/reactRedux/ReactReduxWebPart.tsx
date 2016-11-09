import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  IWebPartContext,
  PropertyPaneTextField,
  PropertyPaneDropdown
} from '@microsoft/sp-webpart-base';
import { bindActionCreators, Store } from 'redux';
import { Provider } from 'react-redux';

import * as strings from 'reactReduxStrings';
import DefaultContainer from './containers/DefaultContainer';
import { IReactReduxWebPartProps } from './IReactReduxWebPartProps';
import { createStore, IState } from './store';
import { applyProperties, updateProperty } from './reducers/webpart';
import { fetchEndpoint } from './reducers/async';

export default class ReactReduxWebPart extends BaseClientSideWebPart<IReactReduxWebPartProps> {
  private store: Store<IState>;
  private fetchEndpoint = fetchEndpoint;

  public constructor(context: IWebPartContext) {
    super(context);

    this.store = createStore();
  }

  public render(): void {
    if (this.renderedOnce) { return; }

    const element = (
      <Provider store={this.store}>
        <DefaultContainer />
      </Provider>
    );

    ReactDom.render(element, this.domElement);
  }

  protected get disableReactivePropertyChanges() {
    return this.properties ? this.properties.disableReactive : false;
  }

  protected onPropertyChanged(propertyPath, oldValue, newValue) {
    if (!this.disableReactivePropertyChanges) {
      this.store.dispatch(updateProperty(propertyPath, newValue));

      if (propertyPath === 'endpoint') {
        this.fetchEndpoint(newValue, this.context);
      }
    }
  }

  protected onInit() {
    this.store.dispatch(applyProperties(this.properties));
    this.fetchEndpoint = bindActionCreators(fetchEndpoint, this.store.dispatch);

    if (this.properties.endpoint) {
      this.fetchEndpoint(this.properties.endpoint, this.context);
    }

    return Promise.resolve(true);
  }

  protected onAfterPropertyPaneChangesApplied() {
    this.store.dispatch(applyProperties(this.properties));
  }

  protected get propertyPaneSettings(): IPropertyPaneSettings {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('name', {
                  label: strings.NameFieldLabel
                }),
                PropertyPaneDropdown('endpoint', {
                  label: strings.EndpointFieldLabel,
                  options: [
                    { key: 'CurrentUser', text: 'Current User' },
                    { key: 'SiteUsers', text: 'SiteUsers' },
                    { key: 'WebInfos', text: 'WebInfos' }
                  ]
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
