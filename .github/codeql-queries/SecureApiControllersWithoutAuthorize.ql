/**
 * @name Secure API controllers without Authorize attribute
 * @description Secure controllers within an 'api-secure' route must have an Authorize attribute.
 * @kind problem
 * @problem.severity warning
 * @id demo/api-controller-without-authorize
 * @tags security
 *       api
 */

 import csharp
 import semmle.code.csharp.Attribute
 
 from Class controllerClass, Attribute routeAttribute
 where controllerClass = routeAttribute.getTarget()
     and routeAttribute.getType().hasName("RouteAttribute")
     and routeAttribute.getArgument(0).getValue().matches("%api-secure/%")
     and not exists(Attribute authorizeAttribute |
         authorizeAttribute.getTarget() = controllerClass and
         authorizeAttribute.getType().hasName("AuthorizeAttribute")
     )
select controllerClass, "This controller serving API a secret route does not have the 'Authorize' attribute."