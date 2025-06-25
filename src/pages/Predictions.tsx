import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, TrendingUp, MapPin, Clock, Users, Zap, Shield, Activity, Settings, Eye } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Prediction {
  id: string;
  title: string;
  type: 'natural-disaster' | 'economic' | 'political' | 'health' | 'security' | 'environmental' | 'cyber' | 'misinformation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  probability: number;
  timeframe: string;
  description: string;
  lastUpdated: string;
  sources: string[];
  impact: string;
  excerpt: string;
}

const Predictions = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isConfigured, setIsConfigured] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  // Mock prediction data for demo - these will be replaced by real-time data
  const mockPredictions: Prediction[] = [
    {
      id: '1',
      title: 'Potential Seismic Activity in Pacific Ring of Fire',
      type: 'natural-disaster',
      severity: 'high',
      location: 'Pacific Ring of Fire',
      probability: 78,
      timeframe: '2-4 weeks',
      description: 'Increased tectonic activity detected along multiple fault lines. Historical patterns suggest elevated earthquake risk with potential magnitude 6.5-7.2.',
      excerpt: 'Elevated earthquake risk detected in Pacific region...',
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
      description: 'Currency fluctuations and trade disruptions may affect regional economic stability. Market indicators suggest 15-20% volatility increase.',
      excerpt: 'Regional economic instability predicted...',
      lastUpdated: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      sources: ['World Bank', 'IMF', 'Regional Financial Institutions'],
      impact: 'Potential effects on regional trade and investment flows'
    },
    {
      id: '3',
      title: 'Cyber Threat Level Elevation - Phoxtra Alert',
      type: 'cyber',
      severity: 'critical',
      location: 'Global',
      probability: 85,
      timeframe: '3-7 days',
      description: 'Advanced persistent threat groups showing increased activity targeting critical infrastructure. New malware variants detected.',
      excerpt: 'Critical cyber threats detected across multiple sectors...',
      lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      sources: ['Phoxtra Cyber Intelligence', 'CISA', 'Amniva Security Network'],
      impact: 'Potential disruption to digital services and data security'
    },
    {
      id: '4',
      title: 'Misinformation Campaign Detection',
      type: 'misinformation',
      severity: 'high',
      location: 'North America',
      probability: 72,
      timeframe: '1-3 weeks',
      description: 'Coordinated disinformation campaign detected across social media platforms targeting electoral processes.',
      excerpt: 'Coordinated disinformation campaign identified...',
      lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      sources: ['Amniva Misinformation Tracker', 'Social Media Analytics', 'Fact-Check Networks'],
      impact: 'Potential to influence public opinion and democratic processes'
    },
    {
      id: '5',
      title: 'Environmental Health Alert - Air Quality Decline',
      type: 'environmental',
      severity: 'medium',
      location: 'Urban Centers - Asia',
      probability: 68,
      timeframe: '2-3 weeks',
      description: 'Industrial emissions and weather patterns creating hazardous air quality conditions in major metropolitan areas.',
      excerpt: 'Air quality deterioration forecast for major cities...',
      lastUpdated: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      sources: ['Environmental Protection Agencies', 'Satellite Monitoring', 'Health Organizations'],
      impact: 'Public health concerns and potential respiratory issues'
    },
    {
      id: '6',
      title: 'Political Instability Indicators Rising',
      type: 'political',
      severity: 'medium',
      location: 'West Africa',
      probability: 58,
      timeframe: '1-2 months',
      description: 'Social unrest indicators and political tension metrics showing concerning trends in the region.',
      excerpt: 'Political tension indicators showing upward trends...',
      lastUpdated: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      sources: ['Political Risk Analysis', 'Social Media Sentiment', 'Regional Intelligence'],
      impact: 'Potential for civil unrest and regional instability'
    },
    {
      id: '7',
      title: 'Epidemiological Alert - Respiratory Illness Surge',
      type: 'health',
      severity: 'high',
      location: 'Northern Hemisphere',
      probability: 74,
      timeframe: '2-4 weeks',
      description: 'Seasonal respiratory illness patterns showing earlier onset with higher than normal infection rates.',
      excerpt: 'Respiratory illness surge predicted for coming weeks...',
      lastUpdated: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      sources: ['WHO', 'CDC', 'Global Health Monitoring Network'],
      impact: 'Healthcare system strain and public health measures'
    },
    {
      id: '8',
      title: 'Supply Chain Disruption Alert',
      type: 'economic',
      severity: 'medium',
      location: 'Global Shipping Routes',
      probability: 62,
      timeframe: '3-5 weeks',
      description: 'Weather patterns and geopolitical tensions may impact major shipping corridors affecting global trade.',
      excerpt: 'Global supply chain vulnerabilities identified...',
      lastUpdated: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      sources: ['Maritime Intelligence', 'Trade Analytics', 'Weather Services'],
      impact: 'Potential delays in global commodity and manufactured goods'
    },
    {
      id: '9',
      title: 'Infrastructure Security Vulnerabilities',
      type: 'security',
      severity: 'high',
      location: 'Urban Infrastructure',
      probability: 71,
      timeframe: '1-2 weeks',
      description: 'Analysis indicates potential vulnerabilities in critical urban infrastructure systems requiring attention.',
      excerpt: 'Critical infrastructure vulnerabilities detected...',
      lastUpdated: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
      sources: ['Infrastructure Monitoring', 'Security Analytics', 'Amniva Intelligence'],
      impact: 'Potential service disruptions and safety concerns'
    }
  ];

  useEffect(() => {
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
      case 'cyber':
        return <Zap className="h-5 w-5" />;
      case 'environmental':
        return <MapPin className="h-5 w-5" />;
      case 'misinformation':
        return <Eye className="h-5 w-5" />;
      default:
        return <TrendingUp className="h-5 w-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'natural-disaster':
        return 'Natural Disasters';
      case 'economic':
        return 'Economic Predictions';
      case 'political':
        return 'Political Trends';
      case 'health':
        return 'Health Alerts';
      case 'security':
        return 'Security Forecasts';
      case 'cyber':
        return 'Cyber Threats';
      case 'environmental':
        return 'Environmental Hazards';
      case 'misinformation':
        return 'Misinformation Signals';
      default:
        return type;
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

  const predictionCategories = [
    { type: 'natural-disaster', count: mockPredictions.filter(p => p.type === 'natural-disaster').length },
    { type: 'economic', count: mockPredictions.filter(p => p.type === 'economic').length },
    { type: 'security', count: mockPredictions.filter(p => p.type === 'security').length },
    { type: 'political', count: mockPredictions.filter(p => p.type === 'political').length },
    { type: 'misinformation', count: mockPredictions.filter(p => p.type === 'misinformation').length },
    { type: 'environmental', count: mockPredictions.filter(p => p.type === 'environmental').length },
    { type: 'cyber', count: mockPredictions.filter(p => p.type === 'cyber').length },
    { type: 'health', count: mockPredictions.filter(p => p.type === 'health').length },
  ];

  if (showDemo) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Centered Header Section */}
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <h1 className="text-4xl font-bold text-gray-900">Prediction Results - Demo</h1>
              </div>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Sample prediction results showcasing AI-powered analysis across multiple categories.
              </p>
              <div className="mt-4">
                <Button
                  onClick={() => setShowDemo(false)}
                  variant="outline"
                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  Back to Main
                </Button>
              </div>
            </div>

            {/* Categories Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {predictionCategories.map((category) => (
                <Card key={category.type} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      {getTypeIcon(category.type)}
                    </div>
                    <h3 className="font-medium text-sm mb-1">{getTypeLabel(category.type)}</h3>
                    <p className="text-2xl font-bold text-blue-600">{category.count}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Filter Section */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  variant={selectedType === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedType('all')}
                  className="text-sm"
                >
                  All Categories
                </Button>
                {predictionCategories.map((category) => (
                  <Button
                    key={category.type}
                    variant={selectedType === category.type ? 'default' : 'outline'}
                    onClick={() => setSelectedType(category.type)}
                    className="text-sm"
                  >
                    {getTypeLabel(category.type)} ({category.count})
                  </Button>
                ))}
              </div>
            </div>

            {/* Predictions Grid */}
            <div className="grid gap-6">
              {(selectedType === 'all' ? mockPredictions : mockPredictions.filter(p => p.type === selectedType)).map((prediction) => (
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
                              {prediction.probability}% confidence
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
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Centered Header Section */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">Prediction Insight</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              AI-powered early warning system for natural disasters, economic shifts, and global events.
            </p>
          </div>

          {/* Main Content */}
          {!isConfigured ? (
            <Card className="mb-8">
              <CardContent className="p-8 text-center">
                <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Prediction Insight</h3>
                <p className="text-gray-600 mb-6">
                  Prediction results are not yet available. Please check back soon.
                </p>
                <Button 
                  onClick={() => setShowDemo(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg"
                >
                  Enable Demo
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Filter Section */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button
                    variant={selectedType === 'all' ? 'default' : 'outline'}
                    onClick={() => setSelectedType('all')}
                    className="text-sm"
                  >
                    All Predictions
                  </Button>
                  {predictionCategories.map((category) => (
                    <Button
                      key={category.type}
                      variant={selectedType === category.type ? 'default' : 'outline'}
                      onClick={() => setSelectedType(category.type)}
                      className="text-sm"
                    >
                      {getTypeLabel(category.type)}
                    </Button>
                  ))}
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
