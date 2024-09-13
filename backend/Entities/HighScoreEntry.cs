namespace backend.Entities;

public class HighScoreEntry
{
    public int Id { get; set; }
    public string PlayerName { get; set; } = string.Empty;
    public int Score { get; set; }
    public DateTime DateAchieved { get; set; }
}