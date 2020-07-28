import Vue, { VNode } from 'vue'
import jQuery from 'jquery/index'
import { AxiosResponse, AxiosError } from 'axios/index'
declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any
    }
  }
  interface JqXHR extends JQuery.jqXHR {}
  interface AxiosRes extends AxiosResponse {}
  interface AxiosErr extends AxiosError {}
}
