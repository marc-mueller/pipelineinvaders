using backend.Dtos;
using backend.Entities;
using backend.Mappers;
using backend.Storage;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HighScoreController : ControllerBase
{
    private readonly ILogger<HighScoreController> _logger;
    private readonly HighScoreDbContext _context;

    public HighScoreController(ILogger<HighScoreController> logger, HighScoreDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    // GET api/highscore
    [HttpGet]
    public async Task<ActionResult<IEnumerable<HighScoreEntryDto>>> Get()
    {
        var highScores = await _context.HighScores
            .OrderByDescending(h => h.Score) // Order by highest score first
            .ToListAsync();

        var highScoreDtos = highScores.Select(h => HighScoreEntryMapper.ToDto(h)).ToList();

        return Ok(highScoreDtos);
    }

    // GET api/highscore/top10byday
    [HttpGet("top10byday")]
    public async Task<ActionResult<IEnumerable<HighScoreEntryDto>>> GetTop10ByDay()
    {
        var today = DateTime.Today;
        var highScores = await _context.HighScores
            .Where(h => h.DateAchieved >= today)
            .OrderByDescending(h => h.Score)
            .Take(10)
            .ToListAsync();

        var highScoreDtos = highScores.Select(h => HighScoreEntryMapper.ToDto(h)).ToList();

        return Ok(highScoreDtos);
    }

    // GET api/highscore/top10byweek
    [HttpGet("top10byweek")]
    public async Task<ActionResult<IEnumerable<HighScoreEntryDto>>> GetTop10ByWeek()
    {
        var startOfWeek = DateTime.Today.AddDays(-(int)DateTime.Today.DayOfWeek);
        var highScores = await _context.HighScores
            .Where(h => h.DateAchieved >= startOfWeek)
            .OrderByDescending(h => h.Score)
            .Take(10)
            .ToListAsync();

        var highScoreDtos = highScores.Select(h => HighScoreEntryMapper.ToDto(h)).ToList();

        return Ok(highScoreDtos);
    }

    // GET api/highscore/top10bymonth
    [HttpGet("top10bymonth")]
    public async Task<ActionResult<IEnumerable<HighScoreEntryDto>>> GetTop10ByMonth()
    {
        var startOfMonth = new DateTime(DateTime.Today.Year, DateTime.Today.Month, 1);
        var highScores = await _context.HighScores
            .Where(h => h.DateAchieved >= startOfMonth)
            .OrderByDescending(h => h.Score)
            .Take(10)
            .ToListAsync();

        var highScoreDtos = highScores.Select(h => HighScoreEntryMapper.ToDto(h)).ToList();

        return Ok(highScoreDtos);
    }

    // POST api/highscore
    [HttpPost]
    public async Task<IActionResult> Post([FromBody] HighScoreEntryDto highScoreEntryDto)
    {
        if (highScoreEntryDto == null || string.IsNullOrWhiteSpace(highScoreEntryDto.PlayerName))
        {
            return BadRequest("Invalid highscore entry");
        }

        var highScoreEntry = HighScoreEntryMapper.FromDto(highScoreEntryDto);

        _context.HighScores.Add(highScoreEntry);
        await _context.SaveChangesAsync();

        _logger.LogInformation($"New high score entry added: {highScoreEntry.PlayerName} - {highScoreEntry.Score}");

        return Ok();
    }
}
