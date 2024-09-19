using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EncryptionController : Controller
{
    private readonly ILogger<HighScoreController> _logger;

    public EncryptionController(ILogger<HighScoreController> logger)
    {
        _logger = logger;
    }

    [HttpGet("Encryption/EncryptString/{input}")]
    public IActionResult EncryptString(string input)
    {
        var badEncryptionService = new BadEncryptionService();
        return Ok(badEncryptionService.Encrypt(input));
    }
}

public class BadEncryptionService
    {
        public byte[] Encrypt(string plainText)
        {
            var symmetricProvider = new DESCryptoServiceProvider();
            byte[] key = { 14, 48, 157, 156, 42, 1, 240, 65 };
            symmetricProvider.Key = key;
            var encryptor = symmetricProvider.CreateEncryptor();

            var plainBytes = Encoding.UTF8.GetBytes(plainText);

            var encryptedBytes = encryptor.TransformFinalBlock(plainBytes, 0, plainBytes.Length);

            return encryptedBytes;
        }

        public string CreateMD5(string input)
        {
            using (var md5 = MD5.Create())
            {
                var hashBytes = md5.ComputeHash(Encoding.UTF8.GetBytes(input));
                return Convert.ToHexString(hashBytes);
            }
        }
    }

