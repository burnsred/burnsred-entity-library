import _compose from 'lodash/fp/compose';
import _isFunction from 'lodash/isFunction';
import _isString from 'lodash/isString';
import exact from 'prop-types-exact';
import PropTypes from 'prop-types';
import PropTypesPlus from '@gnowth/prop-types-plus';
import React from 'react';
import { withPropMapper, withPropTypes } from '@gnowth/higher-order-component';

import { withFormDefault } from './context';
import withInput from './withInput';

class Input extends React.Component {
  getProps() {
    return Object.assign(
      {
        name: this.props.name,
        onChange: this.props.onChange,
        value: this.props.value,
      },
      !_isString(this.props.component) && {
        errors: this.props.errors,
        field: this.props.field,
        initialValue: this.props.initialValue,
        onInputChange: this.props.onInputChange,
        options: this.props.options,
        processing: this.props.processing,
        processingDidFail: this.props.processing,
      },
      _isFunction(this.props.componentProps)
        ? this.props.componentProps(this.props)
        : this.props.componentProps,
    );
  }

  renderAsComponent(props) {
    const WrapperComponent = this.props.wrapperComponent || React.Fragment;

    return (
      <WrapperComponent {...(this.props.wrapperComponentProps || {})}>
        { this.props.many
          ? this.renderComponentArray(props)
          : this.renderComponent(props)
        }
      </WrapperComponent>
    );
  }

  renderComponent(props) {
    return (
      <this.props.component {...props} />
    );
  }

  renderComponentArray(props) {
    console.log('component', this.props.component)
    return props.value.map((val, index) => (
      <this.props.component
        {...props}
        data-index={index}
        index={index}
        key={index}
        value={val}
      />
    ));
  }

  render() {
    return this.props.children
      ? this.props.children(this.getProps())
      : this.renderAsComponent(this.getProps());
  }
}

Input.propTypes = {
  children: PropTypes.func,
  component: PropTypesPlus.isRequiredIfNot('children', PropTypesPlus.component),
  componentProps: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.func,
  ]),
  many: PropTypesPlus.notRequiredIf('children', PropTypes.bool), // TODO check that field is many
  wrapperComponent: PropTypesPlus.isRequiredIf('wrapperComponentProps', PropTypesPlus.component),
  wrapperComponentProps: PropTypes.shape({}),
};

Input.defaultProps = {
  children: undefined,
  component: undefined,
  componentProps: {},
  many: undefined,
  wrapperComponent: undefined,
  wrapperComponentProps: undefined,
};

// TODO check withPropTypes
export default _compose(
  withPropTypes({
    displayName: 'Input',

    propTypes: exact({
      apiOptions: PropTypes.bool,
      apiValue: PropTypes.bool,
      children: PropTypes.func,
      component: PropTypesPlus.component,
      componentProps: PropTypes.oneOfType([
        PropTypes.shape({}),
        PropTypes.func,
      ]),
      many: PropTypesPlus.notRequiredIf('children', PropTypes.bool),
      name: PropTypesPlus.string,
      type: PropTypes.string,
      willChangeRecord: PropTypes.func,
      wrapperComponent: PropTypesPlus.component,
      wrapperComponentProps: PropTypes.shape({}),
    }),

    defaultProps: {
      apiOptions: false,
      apiValue: false,
      children: undefined,
      component: undefined,
      componentProps: {},
      many: undefined,
      name: undefined,
      type: undefined,
      willChangeRecord: ({ nextRecord }) => nextRecord,
      wrapperComponentProps: undefined,
    },
  }),

  withInput,
  withFormDefault,

  withPropMapper(props => ({
    component: props.component || props.defaultWidgets[props.type || props.field.constructor.type],
    wrapperComponent: props.wrapperComponent || props.defaultComponents.wrapper,
  })),
)(Input);
