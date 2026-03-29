import ContainerObject from './domain/Object/ContainerObject.js'
import FilterString from './domain/Object/FilterString.js'
import FullObject from './domain/Object/FullObject.js'
import NonEmptyObject from './domain/Object/NonEmptyObject.js'
import ObjectWithAlias from './domain/Object/ObjectWithAlias.js'
import UndefinedObject from './domain/Object/UndefinedObject.js'
import clone from './utils/clone.js'
import merge from './utils/merge.js'
import NaN0 from './domain/NaN0.js'
import Parser, { Node } from './domain/Parser/index.js'
import resolveAliases from './utils/resolveAliases.js'
import resolveDefaults from './utils/resolveDefaults.js'
import resolveValidation from './utils/resolveValidation.js'
import { Model } from './Model.js'
import ModelError from './domain/ModelError.js'
import { createT } from './utils/TFunction.js'

/** @typedef {import('./utils/TFunction.js').TFunction} TFunction */

export * from './utils/core.js'

export {
	FilterString,
	FullObject,
	UndefinedObject,
	ObjectWithAlias,
	ContainerObject,
	NonEmptyObject,
	clone,
	merge,
	Parser,
	Node,
	NaN0,
	resolveAliases,
	resolveDefaults,
	resolveValidation,
	Model,
	ModelError,
	createT,
	createT as TFunction,
}

export default NaN0
