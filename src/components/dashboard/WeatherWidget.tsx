import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, MapPin, Loader2, CloudSnow, CloudDrizzle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OPENWEATHER_API_KEY = '8d3f4ca45e3ببببببف2aefe0f63733c6c'; // Free API key for demo

const WeatherWidget = () => {
  const [weather, setWeather] = useState({
    location: '',
    temperature: 0,
    condition: 'Loading...',
    humidity: 0,
    windSpeed: 0,
    lastUpdated: new Date(),
    isConfigured: false,
    isLoading: true,
    error: null as string | null
  });

  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  useEffect(() => {
    getCurrentLocationWeather();
    
    // Auto-refresh every 1 hour (3600000ms)
    const interval = setInterval(() => {
      if (weather.isConfigured && !weather.isLoading) {
        getCurrentLocationWeather();
      }
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const getCurrentLocationWeather = async () => {
    if (!navigator.geolocation) {
      // Default to Accra if geolocation not supported
      await fetchWeatherByCity('Accra', 'Ghana');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await fetchWeatherByCoords(latitude, longitude);
        setLocationPermission('granted');
      },
      async (error) => {
        console.error('Geolocation error:', error);
        setLocationPermission('denied');
        // Fallback to Accra
        await fetchWeatherByCity('Accra', 'Ghana');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    setWeather(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();
      
      setWeather({
        location: `${data.name}, ${data.sys.country}`,
        temperature: Math.round(data.main.temp),
        condition: mapWeatherCondition(data.weather[0].main, data.weather[0].description),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        lastUpdated: new Date(),
        isConfigured: true,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Error fetching weather:', error);
      setWeather(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to fetch weather data',
        isConfigured: false
      }));
    }
  };

  const fetchWeatherByCity = async (city: string, country: string) => {
    setWeather(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&units=metric&appid=${OPENWEATHER_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();
      
      setWeather({
        location: `${data.name}, ${data.sys.country}`,
        temperature: Math.round(data.main.temp),
        condition: mapWeatherCondition(data.weather[0].main, data.weather[0].description),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6),
        lastUpdated: new Date(),
        isConfigured: true,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Error fetching weather:', error);
      setWeather(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to fetch weather data',
        isConfigured: false
      }));
    }
  };

  const mapWeatherCondition = (main: string, description: string): string => {
    const conditionMap: Record<string, string> = {
      'Clear': 'Sunny',
      'Clouds': 'Cloudy',
      'Rain': 'Rainy',
      'Drizzle': 'Light Rain',
      'Thunderstorm': 'Stormy',
      'Snow': 'Snowy',
      'Mist': 'Misty',
      'Fog': 'Foggy',
      'Haze': 'Hazy'
    };
    
    return conditionMap[main] || description;
  };

  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    
    if (lowerCondition.includes('sunny') || lowerCondition.includes('clear')) {
      return <Sun className="w-8 h-8 text-yellow-500" />;
    } else if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
      return <CloudRain className="w-8 h-8 text-blue-500" />;
    } else if (lowerCondition.includes('snow')) {
      return <CloudSnow className="w-8 h-8 text-blue-300" />;
    } else if (lowerCondition.includes('cloud')) {
      return <Cloud className="w-8 h-8 text-gray-500" />;
    } else {
      return <Cloud className="w-8 h-8 text-gray-500" />;
    }
  };

  const requestLocationPermission = () => {
    setWeather(prev => ({ ...prev, isLoading: true, error: null }));
    getCurrentLocationWeather();
  };

  if (weather.isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            Live Weather
          </CardTitle>
          <CardDescription>Getting your location weather...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Loader2 className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Loading weather data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weather.isConfigured || weather.error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-orange-500" />
            Live Weather
          </CardTitle>
          <CardDescription>
            Weather data for your current location
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <MapPin className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">
              {weather.error || 'Location access required for weather data'}
            </p>
            <Button 
              variant="outline" 
              className="text-sm"
              onClick={requestLocationPermission}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Enable Location Access
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
            <div className="flex items-center justify-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <h3 className="text-lg font-medium text-gray-900">{weather.location}</h3>
            </div>
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
              Auto-refreshes every 1 hour
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
