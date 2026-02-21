import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, BarChart3, Clock, DollarSign, Shield, Activity, 
  Globe, Building2, Landmark, Lightbulb, AlertTriangle, MapPin 
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Prediction {
  id: string;
  title: string;
  type: 'market-forecast' | 'economic' | 'investment' | 'risk' | 'innovation' | 'trade';
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
  const [isConfigured, setIsConfigured] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const demoPredictions: Prediction[] = [
    {
      id: '1',
      title: 'S&P 500 Correction Signal Based on Yield Curve Inversion',
      type: 'market-forecast',
      severity: 'high',
      location: 'US Markets',
      probability: 78,
      timeframe: '2–6 weeks',
      description: 'Historical yield curve inversion patterns combined with declining consumer confidence suggest a 10–15% correction in large-cap equities. Sector rotation from growth to value stocks accelerating.',
      lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      sources: ['Bloomberg Terminal', 'Federal Reserve Data', 'Amniva Forecast Engine'],
      impact: 'Portfolio rebalancing opportunity for institutional investors'
    },
    {
      id: '2',
      title: 'Emerging Market Currency Volatility Spike Forecast',
      type: 'economic',
      severity: 'medium',
      location: 'Southeast Asia & LATAM',
      probability: 65,
      timeframe: '1–3 months',
      description: 'Capital outflows from emerging markets intensifying amid divergent central bank policies. IDR, BRL, and ZAR showing elevated risk premiums.',
      lastUpdated: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      sources: ['IMF', 'World Bank', 'Amniva Risk Analytics'],
      impact: 'FX hedging costs expected to rise 20–30% for cross-border trade'
    },
    {
      id: '3',
      title: 'Private Equity Dry Powder Deployment Acceleration',
      type: 'investment',
      severity: 'low',
      location: 'Global',
      probability: 82,
      timeframe: '3–6 months',
      description: 'Record $2.8T in uncommitted PE capital combined with declining valuations creating favorable deal environment. Mid-market M&A activity projected to surge.',
      lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      sources: ['Preqin', 'PitchBook', 'Amniva Intelligence'],
      impact: 'Increased deal flow for entrepreneurs seeking growth capital'
    },
    {
      id: '4',
      title: 'Commodity Supply Disruption Risk — Critical Minerals',
      type: 'risk',
      severity: 'critical',
      location: 'Central Africa & South America',
      probability: 71,
      timeframe: '1–2 months',
      description: 'Geopolitical tensions and regulatory changes in lithium and cobalt-producing regions threatening EV and tech supply chains.',
      lastUpdated: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      sources: ['Amniva Risk Engine', 'Reuters Commodities', 'USGS'],
      impact: 'Price spikes in battery metals affecting EV manufacturers and tech hardware'
    },
    {
      id: '5',
      title: 'Fintech Regulatory Convergence Across G20 Nations',
      type: 'innovation',
      severity: 'medium',
      location: 'G20 Economies',
      probability: 68,
      timeframe: '6–12 months',
      description: 'Coordinated regulatory frameworks for digital assets, open banking, and AI in financial services creating new market entry opportunities.',
      lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      sources: ['BIS', 'FSB', 'Amniva Policy Tracker'],
      impact: 'Reduced compliance costs for cross-border fintech expansion'
    },
    {
      id: '6',
      title: 'Trans-Pacific Trade Route Capacity Constraints',
      type: 'trade',
      severity: 'high',
      location: 'Pacific Shipping Corridors',
      probability: 74,
      timeframe: '2–4 weeks',
      description: 'Port congestion and vessel availability issues along major trans-Pacific routes. Container freight rates projected to increase 25–40%.',
      lastUpdated: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      sources: ['Maritime Intelligence', 'Drewry Shipping', 'Amniva Trade Analytics'],
      impact: 'Supply chain delays for importers; cost pass-through to consumer goods'
    }
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      if (isConfigured) {
        setPredictions(demoPredictions);
      }
      setLoading(false);
    }, 800);
  }, [isConfigured]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'market-forecast': return <BarChart3 className="h-5 w-5" />;
      case 'economic': return <DollarSign className="h-5 w-5" />;
      case 'investment': return <Landmark className="h-5 w-5" />;
      case 'risk': return <AlertTriangle className="h-5 w-5" />;
      case 'innovation': return <Lightbulb className="h-5 w-5" />;
      case 'trade': return <Globe className="h-5 w-5" />;
      default: return <TrendingUp className="h-5 w-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'market-forecast': return 'Market Forecast';
      case 'economic': return 'Economic Outlook';
      case 'investment': return 'Investment Signals';
      case 'risk': return 'Risk Assessment';
      case 'innovation': return 'Innovation & Disruption';
      case 'trade': return 'Trade & Supply Chain';
      default: return type;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const updated = new Date(timestamp);
    const diff = Math.floor((now.getTime() - updated.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const predictionCategories = [
    { type: 'market-forecast', count: demoPredictions.filter(p => p.type === 'market-forecast').length },
    { type: 'economic', count: demoPredictions.filter(p => p.type === 'economic').length },
    { type: 'investment', count: demoPredictions.filter(p => p.type === 'investment').length },
    { type: 'risk', count: demoPredictions.filter(p => p.type === 'risk').length },
    { type: 'innovation', count: demoPredictions.filter(p => p.type === 'innovation').length },
    { type: 'trade', count: demoPredictions.filter(p => p.type === 'trade').length },
  ];

  const filteredPredictions = selectedType === 'all' 
    ? predictions 
    : predictions.filter(p => p.type === selectedType);

  const renderPredictionCards = (data: Prediction[]) => (
    <div className="grid gap-6">
      {data.map((prediction) => (
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
                    <span className="text-sm text-muted-foreground">
                      {prediction.probability}% confidence
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right text-sm text-muted-foreground">
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
              <p className="text-muted-foreground">{prediction.description}</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Timeframe</h4>
                  <p className="text-sm text-muted-foreground">{prediction.timeframe}</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Business Impact</h4>
                  <p className="text-sm text-muted-foreground">{prediction.impact}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Sources</h4>
                <div className="flex flex-wrap gap-2">
                  {prediction.sources.map((source, index) => (
                    <Badge key={index} variant="outline" className="text-xs">{source}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (showDemo) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <BarChart3 className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-bold text-foreground">Forecast Intelligence — Demo</h1>
              </div>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Live demo of AI-powered business forecasting across markets, investments, risk, and trade.
              </p>
              <div className="mt-4">
                <Button onClick={() => setShowDemo(false)} variant="outline">Back to Main</Button>
              </div>
            </div>

            {/* Category Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {predictionCategories.map((category) => (
                <Card key={category.type} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">{getTypeIcon(category.type)}</div>
                    <h3 className="font-medium text-xs mb-1">{getTypeLabel(category.type)}</h3>
                    <p className="text-2xl font-bold text-primary">{category.count}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-2 justify-center">
              <Button variant={selectedType === 'all' ? 'default' : 'outline'} onClick={() => setSelectedType('all')} className="text-sm">
                All Forecasts
              </Button>
              {predictionCategories.map((cat) => (
                <Button key={cat.type} variant={selectedType === cat.type ? 'default' : 'outline'} onClick={() => setSelectedType(cat.type)} className="text-sm">
                  {getTypeLabel(cat.type)}
                </Button>
              ))}
            </div>

            {renderPredictionCards(
              selectedType === 'all' ? demoPredictions : demoPredictions.filter(p => p.type === selectedType)
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BarChart3 className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">Forecast Intelligence</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              AI-powered business forecasting for market movements, economic shifts, investment signals, and risk assessment.
            </p>
          </div>

          {!isConfigured ? (
            <Card className="mb-8">
              <CardContent className="p-8 text-center">
                <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Forecast Intelligence</h3>
                <p className="text-muted-foreground mb-6">
                  Forecast results are not yet available. Preview sample forecasts using the demo below.
                </p>
                <Button onClick={() => setShowDemo(true)} className="px-6 py-3 text-lg">
                  Enable Demo
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="mb-6 flex flex-wrap gap-2 justify-center">
                <Button variant={selectedType === 'all' ? 'default' : 'outline'} onClick={() => setSelectedType('all')} className="text-sm">
                  All Forecasts
                </Button>
                {predictionCategories.map((cat) => (
                  <Button key={cat.type} variant={selectedType === cat.type ? 'default' : 'outline'} onClick={() => setSelectedType(cat.type)} className="text-sm">
                    {getTypeLabel(cat.type)}
                  </Button>
                ))}
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading forecasts...</p>
                </div>
              ) : (
                renderPredictionCards(filteredPredictions)
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
