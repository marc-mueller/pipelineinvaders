using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Route("api-secure/[controller]")]
[ApiController]
public class AuthorizedAccessControllerA1 : ControllerBase
{
    [HttpGet("GetSecretInfo")]
    public IActionResult GetSecret()
    {
        return Ok("Something secret");
    }

}

