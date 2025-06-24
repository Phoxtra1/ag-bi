
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WeatherWidget = () => {
  const [weather, setWeather] = useState({
    location: 'New York, NY',
    temperature: 22,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12,
    lastUpdated: new Date(),
    isConfigured: false // This would come from admin settings
  });

  useEffect(() => {
    // Auto-refresh every 15 minutes
    const interval = setInterval(() => {
      // In a real app, this would fetch from a weather API
      if (weather.isConfigured) {
        setWeather(prev => ({
          ...prev,
          lastUpdated: new Date(),
          temperature: prev.temperature + Math.floor(Math.random() * 3) - 1 // Small random change
        }));
      }
    }, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, [weather.isConfigured]);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'partly cloudy':
        return <Cloud className="w-8 h-8 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      default:
        return <Cloud className="w-8 h-8 text-gray-500" />;
    }
  };

  // Show placeholder if weather API is not configured
  if (!weather.isConfigured) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-orange-500" />
            Live Weather
          </CardTitle>
          <CardDescription>
            Real-time weather data for your location
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Weather data not available. Connect via admin.</p>
            <Button variant="outline" className="text-sm">
              Configure Weather API
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getWeatherIcon(weather.condition)}
          Live Weather
        </CardTitle>
        <CardDescription>
          Real-time weather data for your location
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">{weather.location}</h3>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Thermometer className="w-5 h-5 text-orange-500" />
              <span className="text-3xl font-bold">{weather.temperature}°C</span>
            </div>
            <p className="text-gray-600 mt-1">{weather.condition}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Humidity</p>
                <p className="text-sm text-gray-600">{weather.humidity}%</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Wind Speed</p>
                <p className="text-sm text-gray-600">{weather.windSpeed} km/h</p>
              </div>
            </div>
          </div>
          
          <div className="text-center pt-2 border-t">
            <p className="text-xs text-gray-500">
              Last updated: {weather.lastUpdated.toLocaleTimeString()}
            </p>
            <p className="text-xs text-gray-500">
              Auto-refreshes every 15 minutes
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
