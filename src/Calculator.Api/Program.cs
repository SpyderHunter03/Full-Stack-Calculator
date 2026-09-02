using Calculator.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddPolicy("ClientDevelopment", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
builder.Services.AddSingleton<ICalculationStore, InMemoryCalculationStore>();
builder.Services.AddScoped<ICalculator, Calculator.Api.Services.Calculator>();
builder.Services.AddScoped<IDateTimeService, DateTimeService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("ClientDevelopment");
app.MapControllers();

app.Run();
