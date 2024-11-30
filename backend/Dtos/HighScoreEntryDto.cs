namespace backend.Dtos;

public class HighScoreEntryDto
{
    public string PlayerName { get; set; } = string.Empty;
    public int Score { get; set; }
    public DateTime DateAchieved { get; set; }
}