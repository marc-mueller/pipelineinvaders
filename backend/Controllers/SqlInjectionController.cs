using backend.Entities;
using backend.Storage;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SqlInjectionController : ControllerBase
{
    private readonly ILogger<HighScoreController> _logger;
    private readonly HighScoreDbContext _context;

    public SqlInjectionController(ILogger<HighScoreController> logger, HighScoreDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    [HttpGet("SqlInjection/SearchPersonalHighScoreInsecure/{name}")]
    public async Task<IActionResult> SearchPersonalHighScoreInsecure(string name)
    {
        var conn = _context.Database.GetDbConnection();
        var query = "SELECT Id, PlayerName, Score FROM HighScoreEntry WHERE PlayerName Like '%" + name + "%'";
        IEnumerable<HighScoreEntry> personalHighScore;

        try
        {
            await conn.OpenAsync();
            personalHighScore = await conn.QueryAsync<HighScoreEntry>(query);
        }

        finally
        {
            conn.Close();
        }
        return Ok(personalHighScore);
    }
}