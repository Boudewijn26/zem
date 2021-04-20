package org.foundationzero.zem.graphql

import com.expediagroup.graphql.generator.hooks.SchemaGeneratorHooks
import graphql.scalars.ExtendedScalars
import graphql.schema.*
import java.time.LocalDate
import java.time.OffsetDateTime
import kotlin.reflect.KClass
import kotlin.reflect.KFunction
import kotlin.reflect.KType
import kotlin.reflect.typeOf

class Hooks: SchemaGeneratorHooks {
  override fun willGenerateGraphQLType(type: KType): GraphQLType? = when (type.classifier as? KClass<*>) {
    OffsetDateTime::class -> ExtendedScalars.DateTime
    LocalDate::class -> ExtendedScalars.Date
    else -> null
  }

  override fun willAddGraphQLTypeToSchema(type: KType, generatedType: GraphQLType): GraphQLType =
    when (val unwrapped = GraphQLTypeUtil.unwrapNonNull(generatedType)) {
        is GraphQLObjectType -> {
          if (unwrapped.fieldDefinitions.any { nonNormalizedFieldName(it) })
           GraphQLObjectType.newObject(unwrapped).fields(unwrapped.fieldDefinitions.map { field -> GraphQLFieldDefinition.newFieldDefinition(field).name(normalizeFieldName(field)).build() }).build()
          else generatedType
        }
      else -> super.didGenerateGraphQLType(type, generatedType)
    }

  override fun didGenerateQueryField(kClass: KClass<*>, function: KFunction<*>, fieldDefinition: GraphQLFieldDefinition): GraphQLFieldDefinition {
    return GraphQLFieldDefinition.newFieldDefinition(fieldDefinition).name(normalizeFieldName(fieldDefinition)).build()
  }

  private fun normalizeFieldName(fieldDefinition: GraphQLFieldDefinition): String =
    when (val dePrefixed = fieldDefinition.name.removePrefix("get")) {
      "ID" -> "id"
      else -> dePrefixed.decapitalize()
    }

  private fun nonNormalizedFieldName(fieldDefinition: GraphQLFieldDefinition): Boolean =
    normalizeFieldName(fieldDefinition) != fieldDefinition.name


  @OptIn(ExperimentalStdlibApi::class)
  override fun isValidFunction(kClass: KClass<*>, function: KFunction<*>): Boolean {
    return !(function.name.startsWith("set") && function.returnType == typeOf<Unit>())
  }
}
