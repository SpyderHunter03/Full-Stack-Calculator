using Calculator.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddSingleton<ICalculationStore, InMemoryCalculationStore>();
builder.Services.AddScoped<ICalculator, Calculator.Api.Services.Calculator>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapControllers();

app.Run();
