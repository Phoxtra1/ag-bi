
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, TrendingUp, MapPin, Clock, Users, Zap, Shield, Activity, Settings } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Prediction {
  id: string;
  title: string;
  type: 'natural-disaster' | 'economic' | 'political' | 'health' | 'security';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  probability: number;
  timeframe: string;
  description: string;
  lastUpdated: string;
  sources: string[];
  impact: string;
}

const Predictions = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isConfigured, setIsConfigured] = useState(false); // Admin configuration status

  // Mock prediction data
  const mockPredictions: Prediction[] = [
    {
      id: '1',
      title: 'Potential Seismic Activity in Pacific Ring of Fire',
      type: 'natural-disaster',
      severity: 'high',
      location: 'Pacific Ring of Fire',
      probability: 78,
      timeframe: '2-4 weeks',
      description: 'Increased tectonic activity detected along multiple fault lines. Historical patterns suggest elevated earthquake risk.',
      lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      sources: ['USGS', 'Japan Meteorological Agency', 'Amniva Seismic Network'],
      impact: 'Potential impact on coastal communities and maritime trade routes'
    },
    {
      id: '2',
      title: 'Economic Volatility Forecast for Emerging Markets',
      type: 'economic',
      severity: 'medium',
      location: 'Southeast Asia',
      probability: 65,
      timeframe: '1-2 months',
      description: 'Currency fluctuations and trade disruptions may affect regional economic stability.',
      lastUpdated: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      sources: ['World Bank', 'IMF', 'Regional Financial Institutions'],
      impact: 'Potential effects on regional trade and investment flows'
    },
    {
      id: '3',
      title: 'Extreme Weather Pattern Development',
      type: 'natural-disaster',
      severity: 'critical',
      location: 'North Atlantic',
      probability: 85,
      timeframe: '3-7 days',
      description: 'Atmospheric conditions indicate formation of severe weather systems with potential for significant disruption.',
      lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      sources: ['NOAA', 'European Centre for Medium-Range Weather Forecasts', 'Amniva Weather AI'],
      impact: 'Potential disruption to transportation and infrastructure'
    },
    {
      id: '4',
      title: 'Cybersecurity Threat Level Elevation',
      type: 'security',
      severity: 'high',
      location: 'Global',
      probability: 72,
      timeframe: '1-3 weeks',
      description: 'Increased cyber threat activity detected across critical infrastructure sectors.',
      lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      sources: ['CISA', 'ENISA', 'Amniva Cyber Intelligence'],
      impact: 'Potential disruption to digital services and data security'
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchPredictions = async () => {
      setLoading(true);
      setTimeout(() => {
        if (isConfigured) {
          setPredictions(mockPredictions);
        }
        setLoading(false);
      }, 1000);
    };

    fetchPredictions();
  }, [isConfigured]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'natural-disaster':
        return <AlertTriangle className="h-5 w-5" />;
      case 'economic':
        return <TrendingUp className="h-5 w-5" />;
      case 'political':
        return <Users className="h-5 w-5" />;
      case 'health':
        return <Activity className="h-5 w-5" />;
      case 'security':
        return <Shield className="h-5 w-5" />;
      default:
        return <Zap className="h-5 w-5" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const updatedDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - updatedDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const filteredPredictions = selectedType === 'all' 
    ? predictions 
    : predictions.filter(p => p.type === selectedType);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <h1 className="text-4xl font-bold text-gray-900">Crisis Predictions</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl">
              AI-powered early warning system for natural disasters, economic shifts, and global events.
            </p>
          </div>

          {/* Configuration Check */}
          {!isConfigured ? (
            <Card className="mb-8">
              <CardContent className="p-8 text-center">
                <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Prediction Engine Not Configured</h3>
                <p className="text-gray-600 mb-4">
                  No predictions yet. Please configure prediction sources and AI models via admin dashboard.
                </p>
                <Button 
                  onClick={() => setIsConfigured(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Enable Demo Mode
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Filter Section */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedType === 'all' ? 'default' : 'outline'}
                    onClick={() => setSelectedType('all')}
                    className="text-sm"
                  >
                    All Predictions
                  </Button>
                  <Button
                    variant={selectedType === 'natural-disaster' ? 'default' : 'outline'}
                    onClick={() => setSelectedType('natural-disaster')}
                    className="text-sm"
                  >
                    Natural Disasters
                  </Button>
                  <Button
                    variant={selectedType === 'economic' ? 'default' : 'outline'}
                    onClick={() => setSelectedType('economic')}
                    className="text-sm"
                  >
                    Economic
                  </Button>
                  <Button
                    variant={selectedType === 'security' ? 'default' : 'outline'}
                    onClick={() => setSelectedType('security')}
                    className="text-sm"
                  >
                    Security
                  </Button>
                </div>
              </div>

              {/* Predictions Grid */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading predictions...</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {filteredPredictions.map((prediction) => (
                    <Card key={prediction.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            {getTypeIcon(prediction.type)}
                            <div>
                              <CardTitle className="text-xl">{prediction.title}</CardTitle>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge className={getSeverityColor(prediction.severity)}>
                                  {prediction.severity.toUpperCase()}
                                </Badge>
                                <span className="text-sm text-gray-500">
                                  {prediction.probability}% probability
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right text-sm text-gray-500">
                            <div className="flex items-center gap-1 mb-1">
                              <Clock className="h-4 w-4" />
                              {formatTimeAgo(prediction.lastUpdated)}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {prediction.location}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-gray-700">{prediction.description}</p>
                          
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Timeframe</h4>
                              <p className="text-sm text-gray-600">{prediction.timeframe}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Potential Impact</h4>
                              <p className="text-sm text-gray-600">{prediction.impact}</p>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Sources</h4>
                            <div className="flex flex-wrap gap-2">
                              {prediction.sources.map((source, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {source}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Predictions;
