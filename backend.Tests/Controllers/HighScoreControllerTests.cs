using backend.Controllers;
using backend.Dtos;
using backend.Entities;
using backend.Mappers;
using backend.Storage;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace backend.Tests.Controllers
{
    public class HighScoreControllerTests
    {
        private readonly Mock<ILogger<HighScoreController>> _loggerMock;
        private readonly DbContextOptions<HighScoreDbContext> _dbContextOptions;

        public HighScoreControllerTests()
        {
            _loggerMock = new Mock<ILogger<HighScoreController>>();
            _dbContextOptions = new DbContextOptionsBuilder<HighScoreDbContext>()
                .UseInMemoryDatabase(databaseName: "HighScoreTestDb")
                .Options;
        }

        [Fact]
        public async Task Get_ReturnsHighScores()
        {
            // Arrange
            using (var context = new HighScoreDbContext(_dbContextOptions))
            {
                context.HighScores.AddRange(
                    new HighScoreEntry { PlayerName = "Player1", Score = 100, DateAchieved = System.DateTime.Now },
                    new HighScoreEntry { PlayerName = "Player2", Score = 200, DateAchieved = System.DateTime.Now }
                );
                context.SaveChanges();
            }

            using (var context = new HighScoreDbContext(_dbContextOptions))
            {
                var controller = new HighScoreController(_loggerMock.Object, context);

                // Act
                var result = await controller.Get();

                // Assert
                var okResult = Assert.IsType<OkObjectResult>(result.Result);
                var highScores = Assert.IsAssignableFrom<IEnumerable<HighScoreEntryDto>>(okResult.Value);
                Assert.Equal(2, highScores.Count());
                Assert.Equal("Player2", highScores.First().PlayerName); // Highest score first
            }
        }

        [Fact]
        public async Task Post_AddsHighScore()
        {
            // Arrange
            var highScoreEntryDto = new HighScoreEntryDto { PlayerName = "Player3", Score = 300, DateAchieved = System.DateTime.Now };

            using (var context = new HighScoreDbContext(_dbContextOptions))
            {
                var controller = new HighScoreController(_loggerMock.Object, context);

                // Act
                var result = await controller.Post(highScoreEntryDto);

                // Assert
                Assert.IsType<OkResult>(result);
                var highScore = context.HighScores.SingleOrDefault(h => h.PlayerName == "Player3");
                Assert.NotNull(highScore);
                Assert.Equal(300, highScore.Score);
            }
        }

        [Fact]
        public async Task Post_ReturnsBadRequest_WhenInvalidEntry()
        {
            // Arrange
            var highScoreEntryDto = new HighScoreEntryDto { PlayerName = "", Score = 300, DateAchieved = System.DateTime.Now };

            using (var context = new HighScoreDbContext(_dbContextOptions))
            {
                var controller = new HighScoreController(_loggerMock.Object, context);

                // Act
                var result = await controller.Post(highScoreEntryDto);

                // Assert
                var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
                Assert.Equal("Invalid highscore entry", badRequestResult.Value);
            }
        }

        [Fact]
        public async Task GetTop10ByDay_ReturnsHighScores()
        {
            // Arrange
            using (var context = new HighScoreDbContext(_dbContextOptions))
            {
                context.HighScores.AddRange(
                    new HighScoreEntry { PlayerName = "Player1", Score = 100, DateAchieved = System.DateTime.Today },
                    new HighScoreEntry { PlayerName = "Player2", Score = 200, DateAchieved = System.DateTime.Today },
                    new HighScoreEntry { PlayerName = "Player3", Score = 300, DateAchieved = System.DateTime.Today.AddDays(-1) }
                );
                context.SaveChanges();
            }

            using (var context = new HighScoreDbContext(_dbContextOptions))
            {
                var controller = new HighScoreController(_loggerMock.Object, context);

                // Act
                var result = await controller.GetTop10ByDay();

                // Assert
                var okResult = Assert.IsType<OkObjectResult>(result.Result);
                var highScores = Assert.IsAssignableFrom<IEnumerable<HighScoreEntryDto>>(okResult.Value);
                Assert.Equal(2, highScores.Count());
                Assert.Equal("Player2", highScores.First().PlayerName); // Highest score first
            }
        }

        [Fact]
        public async Task GetTop10ByWeek_ReturnsHighScores()
        {
            // Arrange
            using (var context = new HighScoreDbContext(_dbContextOptions))
            {
                context.HighScores.AddRange(
                    new HighScoreEntry { PlayerName = "Player1", Score = 100, DateAchieved = System.DateTime.Today },
                    new HighScoreEntry { PlayerName = "Player2", Score = 200, DateAchieved = System.DateTime.Today.AddDays(-3) },
                    new HighScoreEntry { PlayerName = "Player3", Score = 300, DateAchieved = System.DateTime.Today.AddDays(-10) }
                );
                context.SaveChanges();
            }

            using (var context = new HighScoreDbContext(_dbContextOptions))
            {
                var controller = new HighScoreController(_loggerMock.Object, context);

                // Act
                var result = await controller.GetTop10ByWeek();

                // Assert
                var okResult = Assert.IsType<OkObjectResult>(result.Result);
                var highScores = Assert.IsAssignableFrom<IEnumerable<HighScoreEntryDto>>(okResult.Value);
                Assert.Equal(2, highScores.Count());
                Assert.Equal("Player2", highScores.First().PlayerName); // Highest score first
            }
        }

        [Fact]
        public async Task GetTop10ByMonth_ReturnsHighScores()
        {
            // Arrange
            using (var context = new HighScoreDbContext(_dbContextOptions))
            {
                context.HighScores.AddRange(
                    new HighScoreEntry { PlayerName = "Player1", Score = 100, DateAchieved = System.DateTime.Today },
                    new HighScoreEntry { PlayerName = "Player2", Score = 200, DateAchieved = System.DateTime.Today.AddDays(-10) },
                    new HighScoreEntry { PlayerName = "Player3", Score = 300, DateAchieved = System.DateTime.Today.AddMonths(-1) }
                );
                context.SaveChanges();
            }

            using (var context = new HighScoreDbContext(_dbContextOptions))
            {
                var controller = new HighScoreController(_loggerMock.Object, context);

                // Act
                var result = await controller.GetTop10ByMonth();

                // Assert
                var okResult = Assert.IsType<OkObjectResult>(result.Result);
                var highScores = Assert.IsAssignableFrom<IEnumerable<HighScoreEntryDto>>(okResult.Value);
                Assert.Equal(2, highScores.Count());
                Assert.Equal("Player2", highScores.First().PlayerName); // Highest score first
            }
        }
    }
}
