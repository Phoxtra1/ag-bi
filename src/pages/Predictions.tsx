
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Predictions = () => {
  const [predictionResult, setPredictionResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      topic: '',
      region: '',
      description: '',
      category: '',
      file: null
    }
  });

  const categories = [
    'Politics',
    'Weather',
    'Civic Unrest',
    'Elections',
    'Health',
    'Infrastructure',
    'Education',
    'Economy',
    'Other'
  ];

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    
    // Simulate AI prediction processing
    setTimeout(() => {
      const mockPrediction = `Based on the analysis of "${data.topic}" in ${data.region}, our AI system predicts:

📊 **Risk Assessment**: Moderate to High
⏰ **Timeline**: 3-6 months
🎯 **Confidence Level**: 75%

**Key Factors Identified:**
• Historical patterns suggest similar scenarios have led to gradual escalation
• Current social indicators show increasing tension
• Economic factors may amplify the situation

**Potential Outcomes:**
1. **Most Likely (60%)**: Gradual resolution through dialogue and policy adjustments
2. **Secondary (25%)**: Temporary escalation requiring intervention
3. **Less Likely (15%)**: Rapid de-escalation without major changes

This prediction is based on AI analysis of historical data, current trends, and pattern recognition.`;

      setPredictionResult(mockPrediction);
      setIsLoading(false);
      toast.success('Prediction analysis completed!');
    }, 3000);

    toast.info('Analyzing your scenario... This may take a few moments.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            🔮 Global Prediction Portal
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Analyze current issues, uncover hidden trends, and discover possible outcomes with real-time forecasting powered by AI and live data.
          </p>
        </div>
      </section>

      {/* Weather Widget Section */}
      <section className="py-8 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  🌤 Live Weather Forecast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="weather-widget">
                  <a 
                    className="weatherwidget-io" 
                    href="https://forecast7.com/en/n0d52n32d56/accra/" 
                    data-label_1="ACCRA" 
                    data-label_2="WEATHER" 
                    data-theme="pure"
                  >
                    ACCRA WEATHER
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Submit Scenario Column */}
            <div className="lg:col-span-1">
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    📝 Submit a Scenario
                  </CardTitle>
                  <CardDescription>
                    Describe the issue, location, or concern you'd like to predict. This can include politics, natural disasters, weather patterns, civil unrest, infrastructure challenges, etc.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="topic"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prediction Topic</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Election outcome in Ghana 2024" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="region"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country/Region</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Ghana, West Africa" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                              <select 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                {...field}
                              >
                                <option value="">Select a category</option>
                                {categories.map((category) => (
                                  <option key={category} value={category}>
                                    {category}
                                  </option>
                                ))}
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Detailed Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Provide detailed, factual input. Our system uses AI and external APIs to assess outcomes accurately."
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="file"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Attach Supporting Document (optional)</FormLabel>
                            <FormControl>
                              <Input 
                                type="file"
                                accept=".pdf,.docx,.txt"
                                onChange={(e) => field.onChange(e.target.files)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Analyzing...' : 'Submit for Prediction'}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            {/* Predicted Outcome Column */}
            <div className="lg:col-span-1">
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🧠 Predicted Outcome
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!predictionResult && !isLoading && (
                    <div className="text-gray-600 p-8 text-center">
                      <p className="mb-4">
                        Our system will analyze your input using historical data, AI reasoning, and relevant external sources via API to generate predictions about possible outcomes.
                      </p>
                      <div className="flex justify-center gap-4 text-sm">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                          🟢 Low Risk
                        </span>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                          🟡 Moderate Risk
                        </span>
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full">
                          🔴 High Risk
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {isLoading && (
                    <div className="text-center p-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Analyzing scenario and generating predictions...</p>
                    </div>
                  )}
                  
                  {predictionResult && (
                    <div className="space-y-4">
                      <div className="prose prose-sm max-w-none">
                        <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg border">
                          {predictionResult}
                        </pre>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* What to Do Next Column */}
            <div className="lg:col-span-1">
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    ✅ What To Do Next
                  </CardTitle>
                  <CardDescription>
                    AI Recommendations and Guidance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!predictionResult ? (
                    <div className="text-gray-600 space-y-4">
                      <p>After prediction results are processed, you'll receive guidance on:</p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600">📋</span>
                          <span>Possible preventive actions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600">⚠️</span>
                          <span>Risk mitigation strategies</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600">🏛️</span>
                          <span>Policy suggestions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600">🤝</span>
                          <span>Stakeholder engagement tips</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600">📞</span>
                          <span>Relevant authorities to contact</span>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">🎯 Recommended Actions:</h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-green-50 border-l-4 border-green-400">
                          <h5 className="font-medium text-green-800">Immediate Steps</h5>
                          <p className="text-green-700 text-sm">Monitor key indicators and establish early warning systems</p>
                        </div>
                        <div className="p-3 bg-blue-50 border-l-4 border-blue-400">
                          <h5 className="font-medium text-blue-800">Medium-term Actions</h5>
                          <p className="text-blue-700 text-sm">Engage with stakeholders and prepare contingency plans</p>
                        </div>
                        <div className="p-3 bg-purple-50 border-l-4 border-purple-400">
                          <h5 className="font-medium text-purple-800">Long-term Strategy</h5>
                          <p className="text-purple-700 text-sm">Implement systemic changes to address root causes</p>
                        </div>
                      </div>
                      
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h5 className="font-medium mb-2">📞 Key Contacts & Resources:</h5>
                        <ul className="text-sm space-y-1 text-gray-700">
                          <li>• Local government offices</li>
                          <li>• Emergency services</li>
                          <li>• Media outlets</li>
                          <li>• Civil society organizations</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* AI & API Integration Notice */}
      <section className="py-8 bg-white/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2">
                  🤖 AI & API Integration
                </h3>
                <p className="text-gray-600">
                  Our predictions are powered by an internal AI engine and verified through trusted external sources via API. 
                  Results are continuously improved to provide clarity, not final conclusions.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-6 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">
              ⚠️ <strong>Disclaimer:</strong> This prediction tool is for informational purposes only. 
              Users are advised to seek expert guidance when taking action. 
              We are not legally responsible for decisions made based on AI output.
            </p>
          </div>
        </div>
      </section>

      <Footer />

      {/* Weather Widget Script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];
            if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src='https://weatherwidget.io/js/widget.min.js';
            fjs.parentNode.insertBefore(js,fjs);}}(document,'script','weatherwidget-io-js');
          `
        }}
      />
    </div>
  );
};

export default Predictions;
