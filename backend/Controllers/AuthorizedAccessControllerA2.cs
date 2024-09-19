using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Route("api-secure/[controller]")]
[ApiController]
[Authorize]
public class AuthorizedAccessControllerA2 : ControllerBase
{
    [HttpGet("GetSecretInfo")]
    public IActionResult GetSecret()
    {
        return Ok("Something secret");
    }

}

