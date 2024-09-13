namespace backend.Storage;

using backend.Entities;
using Microsoft.EntityFrameworkCore;

public class HighScoreDbContext : DbContext
{
    public HighScoreDbContext(DbContextOptions<HighScoreDbContext> options)
        : base(options)
    {
    }

    public DbSet<HighScoreEntry> HighScores { get; set; }
}
