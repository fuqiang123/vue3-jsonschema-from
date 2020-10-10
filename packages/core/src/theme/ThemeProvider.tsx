import { defineComponent, computed, provide, ComponentPublicInstance, ExtractPropTypes } from 'vue'

import type { PropType } from 'vue'

import { ComponentsContext } from './Context'
import { CommonFieldPropsDefine } from '../types'

import { RegisteredWidgets } from './utils'

import NotFoundWidget from './NotFoundWidget'

const HeaderProps = {
  title: {
    type: String,
    required: true
  },
  type: {
    type: String as PropType<'array' | 'object'>,
    required: true
  }
} as const

type RendererComponentType = ComponentPublicInstance<ExtractPropTypes<typeof CommonFieldPropsDefine>>
type HeaderComponentType = ComponentPublicInstance<ExtractPropTypes<typeof HeaderProps>>

// export type FORM = 'Form' | string
export enum ThemeLayoutsNames {
  Form = 'Form',
  SingleTypeArrayWrapper = 'SingleTypeArrayWrapper',
  Header = 'Header'
}

export enum ThemeRendererComponentNames {
  StringRenderer = 'StringRenderer',
  NumberRenderer = 'NumberRenderer',
  ArrayRenderer = 'ArrayRenderer',
  BooleanRenderer = 'BooleanRenderer',
}

declare type ComponentPublicInstanceConstructor<T extends ComponentPublicInstance> = {
  new (): T;
};

export type RendererComponentDefine = ComponentPublicInstanceConstructor<RendererComponentType>
export type FormDefine = ComponentPublicInstanceConstructor<ComponentPublicInstance<any>>
export type HeaderDefine = ComponentPublicInstanceConstructor<HeaderComponentType>
export type SingleTypeArrayDefine = ComponentPublicInstanceConstructor<ComponentPublicInstance<any>>

export interface Components {
  [ThemeLayoutsNames.Form]: FormDefine,
  [ThemeLayoutsNames.SingleTypeArrayWrapper]: SingleTypeArrayDefine,
  [ThemeLayoutsNames.Header]: HeaderDefine

  [ThemeRendererComponentNames.StringRenderer]: RendererComponentDefine,
  [ThemeRendererComponentNames.NumberRenderer]: RendererComponentDefine,
  [ThemeRendererComponentNames.ArrayRenderer]: RendererComponentDefine,
  [ThemeRendererComponentNames.BooleanRenderer]: RendererComponentDefine
  // [key: string]: any
}

export interface Layouts {
  [ThemeLayoutsNames.Form]: FormDefine,
  [ThemeLayoutsNames.SingleTypeArrayWrapper]: SingleTypeArrayDefine,
  [ThemeLayoutsNames.Header]: HeaderDefine
}

export interface Theme {
  // components: Components
  layouts: Layouts
  widgets: RegisteredWidgets
}

export default defineComponent({
  name: "ThemeProvider",
  props: {
    theme: {
      type: Object as PropType<Theme>,
      required: true
    },
  },
  setup(props, { slots }) {

    const components = computed(() => {
      const { theme } = props
      return {
        layouts: theme.layouts,
        widgets: {
          ...theme.widgets,
          NotFoundWidget,
        }
      }
    })



    provide(ComponentsContext, components)

    return () => {
      if (!slots.default || typeof slots.default !== 'function') {
        throw new Error(`default slot of ThemeProvider should be function`)
      }
      return slots.default && slots.default()
    }
  },
})
