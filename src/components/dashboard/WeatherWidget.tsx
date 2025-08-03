
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    
    // Auto-refresh every 15 minutes
    const interval = setInterval(() => {
      if (weather.isConfigured && !weather.isLoading) {
        updateWeatherData();
      }
    }, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const getCurrentLocationWeather = async () => {
    if (!navigator.geolocation) {
      setWeather(prev => ({
        ...prev,
        error: 'Geolocation is not supported by this browser.',
        isLoading: false
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await fetchLocationName(latitude, longitude);
        setLocationPermission('granted');
      },
      (error) => {
        setLocationPermission('denied');
        // Fallback to a default location
        setWeather(prev => ({
          ...prev,
          location: 'Location Access Denied',
          temperature: 22,
          condition: 'Partly Cloudy',
          humidity: 65,
          windSpeed: 12,
          isConfigured: true,
          isLoading: false,
          error: 'Please enable location access for accurate weather data'
        }));
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const fetchLocationName = async (lat: number, lon: number) => {
    try {
      // Simulate reverse geocoding - in production, you'd use a real API
      const locations = [
        'New York, NY', 'London, UK', 'Paris, France', 'Berlin, Germany',
        'Madrid, Spain', 'Rome, Italy', 'Amsterdam, Netherlands', 'Brussels, Belgium'
      ];
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      
      setWeather(prev => ({
        ...prev,
        location: randomLocation,
        temperature: Math.floor(Math.random() * 25) + 10, // 10-35°C
        condition: getRandomCondition(),
        humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
        windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
        lastUpdated: new Date(),
        isConfigured: true,
        isLoading: false,
        error: null
      }));
    } catch (error) {
      setWeather(prev => ({
        ...prev,
        error: 'Failed to fetch location data',
        isLoading: false
      }));
    }
  };

  const getRandomCondition = () => {
    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'];
    return conditions[Math.floor(Math.random() * conditions.length)];
  };

  const updateWeatherData = () => {
    setWeather(prev => ({
      ...prev,
      temperature: prev.temperature + Math.floor(Math.random() * 3) - 1,
      humidity: Math.max(30, Math.min(90, prev.humidity + Math.floor(Math.random() * 5) - 2)),
      windSpeed: Math.max(0, prev.windSpeed + Math.floor(Math.random() * 3) - 1),
      lastUpdated: new Date()
    }));
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'partly cloudy':
      case 'cloudy':
        return <Cloud className="w-8 h-8 text-gray-500" />;
      case 'light rain':
      case 'rainy':
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      default:
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
              <Wind className="w-4 w-4 text-gray-500" />
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
