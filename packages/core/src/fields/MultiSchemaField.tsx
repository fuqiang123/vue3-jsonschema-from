import { defineComponent, PropType, computed, reactive, watchEffect } from 'vue'
import { JSONSchema6Definition, JSONSchema7Definition } from 'json-schema'

import { CommonFieldPropsDefine, Schema, SchemaTypes } from '../types'
import { useVJSFContext } from '../Context'
import {
  getMatchingOption,
  guessType,
  getDefaultFormState,
  retrieveSchema,
} from '../utils'
import { ThemeLayoutsNames, useWidget } from '../theme'

export default defineComponent({
  name: 'MultiSchemaField',
  props: {
    ...CommonFieldPropsDefine,
    options: {
      type: Array as PropType<
        JSONSchema6Definition[] | JSONSchema7Definition[]
      >,
      required: true,
    },
    baseType: {
      type: String as PropType<SchemaTypes>,
      required: true,
    },
  },
  setup(props) {
    const state = reactive({
      selectedOption: 0,
    })
    const formContextRef = useVJSFContext()

    const isValidRef = computed(() => {
      const { validate } = formContextRef.value
      return (schema: Schema, data: any) => validate(schema, data).valid
    })

    function getMatchingOptionLocal(data: any, options: Schema[]) {
      // const { rootSchema } = props

      let option = getMatchingOption(data, options, isValidRef.value)
      if (option !== 0) {
        return option
      }
      // If the form data matches none of the options, use the currently selected
      // option, assuming it's available; otherwise use the first option
      return state.selectedOption || 0
    }

    const onOptionChange = (option: string) => {
      const selectedOption = parseInt(option, 10)
      const { value, onChange, options } = props
      const { rootSchema } = props
      const newOption = retrieveSchema(
        options[selectedOption],
        rootSchema,
        value,
      )

      // If the new option is of type object and the current data is an object,
      // discard properties added using the old option.
      let newFormData: any = undefined
      if (
        guessType(value) === 'object' &&
        (newOption.type === 'object' || newOption.properties)
      ) {
        newFormData = Object.assign({}, value)

        const optionsToDiscard = options.slice()
        optionsToDiscard.splice(selectedOption, 1)

        // Discard any data added using other options
        for (const option of optionsToDiscard) {
          if (typeof option !== 'boolean' && option.properties) {
            for (const key in option.properties) {
              if (newFormData.hasOwnProperty(key)) {
                delete newFormData[key]
              }
            }
          }
        }
      }
      // Call getDefaultFormState to make sure defaults are populated on change.
      onChange(
        getDefaultFormState(options[selectedOption] as Schema, newFormData),
      )

      state.selectedOption = selectedOption
    }

    const WidgetRef = computed(() => {
      const { uiSchema } = props

      const { widget = 'select' } = uiSchema

      return useWidget({ type: 'number' }, widget as ThemeLayoutsNames).value
    })

    watchEffect(() => {
      state.selectedOption = getMatchingOptionLocal(
        props.value,
        props.options as Schema[],
      )
    })

    return () => {
      const {
        options,
        baseType,
        id,
        schema,
        uiSchema,
        value,
        onChange,
        ...rest
      } = props
      const SchemaItem = formContextRef.value.SchemaItem
      // const { widgets } = registry;
      const { selectedOption } = state
      // const { widget = "select", ...uiOptions } = getUiOptions(uiSchema);
      // const Widget = getWidget({ type: "number" }, widget, widgets);

      const Widget = WidgetRef.value

      const option = options[selectedOption] || null
      let optionSchema

      if (option && typeof option !== 'boolean') {
        // If the subschema doesn't declare a type, infer the type from the
        // parent schema
        optionSchema = option.type
          ? option
          : Object.assign({}, option, { type: baseType })
      }

      const enumOptions = (options as any).map(
        (option: Schema, index: number) => ({
          key: option.title || `Option ${index + 1}`,
          value: index,
        }),
      )

      return (
        <>
          <Widget
            {...rest}
            title="test"
            uiSchema={{}}
            id={`${id}${schema.oneOf ? '__oneof_select' : '__anyof_select'}`}
            schema={{ type: 'number', default: 0 }}
            onChange={onOptionChange}
            value={selectedOption}
            options={{ ...uiSchema, enumOptions }}
          />

          {option !== null && (
            <SchemaItem
              id={id}
              schema={optionSchema as Schema}
              uiSchema={uiSchema}
              // errorSchema={errorSchema}
              value={value}
              onChange={onChange}
              {...rest}
              // disabled={disabled}
            />
          )}
        </>
      )
    }
  },
})
