namespace backend.Mappers;

using System;
using backend.Dtos;
using backend.Entities;

public static class HighScoreEntryMapper
{
    public static HighScoreEntryDto ToDto(this HighScoreEntry highScoreEntry)
    {
        return new HighScoreEntryDto
        {
            PlayerName = highScoreEntry.PlayerName,
            Score = highScoreEntry.Score,
            DateAchieved = highScoreEntry.DateAchieved
        };
    }

    public static HighScoreEntry FromDto(HighScoreEntryDto highScoreEntryDto)
    {
        return new HighScoreEntry
        {
            PlayerName = highScoreEntryDto.PlayerName,
            Score = highScoreEntryDto.Score,
            DateAchieved = highScoreEntryDto.DateAchieved
        };
    }
}