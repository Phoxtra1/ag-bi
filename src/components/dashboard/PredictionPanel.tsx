
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, AlertTriangle, Globe, DollarSign, Send, History, Upload, Lock } from 'lucide-react';

const PredictionPanel = () => {
  const [selectedTool, setSelectedTool] = useState('');
  const [predictionData, setPredictionData] = useState('');

  const predictionTools = [
    {
      id: 'civic',
      name: 'Civic Insight',
      icon: <Globe className="w-5 h-5" />,
      status: 'active',
      description: 'Political and civic trend analysis'
    },
    {
      id: 'disaster',
      name: 'Natural Disaster Alert',
      icon: <AlertTriangle className="w-5 h-5" />,
      status: 'active',
      description: 'Weather and disaster predictions'
    },
    {
      id: 'political',
      name: 'Socio-Political Shift Tracker',
      icon: <TrendingUp className="w-5 h-5" />,
      status: 'inactive',
      description: 'Social and political movement analysis'
    },
    {
      id: 'economic',
      name: 'Economic Forecast',
      icon: <DollarSign className="w-5 h-5" />,
      status: 'active',
      description: 'Economic trend predictions'
    }
  ];

  const recentPredictions = [
    { id: 1, tool: 'Civic Insight', result: 'Positive civic engagement trend', date: '2024-01-15', accuracy: '94%' },
    { id: 2, tool: 'Economic Forecast', result: 'Market stability expected', date: '2024-01-14', accuracy: '87%' },
    { id: 3, tool: 'Disaster Alert', result: 'Low risk weather patterns', date: '2024-01-13', accuracy: '92%' }
  ];

  const handleSubmitPrediction = () => {
    if (selectedTool && predictionData) {
      console.log('Submitting prediction:', { tool: selectedTool, data: predictionData });
      // Here you would integrate with your prediction API
      alert('Prediction submitted successfully!');
      setPredictionData('');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Prediction Tools
          </CardTitle>
          <CardDescription>
            Access our AI-powered prediction tools to analyze trends and forecast outcomes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {predictionTools.map((tool) => (
              <div 
                key={tool.id}
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setSelectedTool(tool.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {tool.icon}
                    <span className="font-medium">{tool.name}</span>
                  </div>
                  <Badge variant={tool.status === 'active' ? 'default' : 'secondary'}>
                    {tool.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{tool.description}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Prediction Tool
              </label>
              <Select value={selectedTool} onValueChange={setSelectedTool}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a prediction tool" />
                </SelectTrigger>
                <SelectContent>
                  {predictionTools.filter(tool => tool.status === 'active').map((tool) => (
                    <SelectItem key={tool.id} value={tool.id}>
                      {tool.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Input Data for Analysis
              </label>
              <Textarea
                placeholder="Enter the data you want to analyze or predict..."
                value={predictionData}
                onChange={(e) => setPredictionData(e.target.value)}
                rows={4}
              />
            </div>

            <Button 
              onClick={handleSubmitPrediction}
              disabled={!selectedTool || !predictionData}
              className="w-full"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit for Prediction
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Custom Data Submission - Placeholder for Paid Users */}
      <Card className="border-dashed border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Submit Custom Data for Prediction
            <Lock className="w-4 h-4 text-amber-500" />
          </CardTitle>
          <CardDescription>
            Upload your own datasets for AI-powered prediction analysis (Premium Feature)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Custom Prediction Analysis</h3>
              <p className="text-sm text-gray-600 mb-4">
                Submit your own data files (CSV, JSON, TXT) for personalized prediction insights
              </p>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                Premium Feature - Subscription Required
              </Badge>
            </div>
            <Button disabled className="bg-gray-300 text-gray-500 cursor-not-allowed">
              <Lock className="w-4 h-4 mr-2" />
              Upgrade to Access
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Recent Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentPredictions.map((prediction) => (
              <div key={prediction.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{prediction.tool}</span>
                  <Badge variant="outline">{prediction.accuracy}</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">{prediction.result}</p>
                <p className="text-xs text-gray-500">{prediction.date}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictionPanel;
