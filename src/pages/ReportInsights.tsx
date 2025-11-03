
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { account } from '@/lib/appwrite';
import { useNavigate } from 'react-router-dom';
import ReportSubmissionForm from '@/components/ReportSubmissionForm';


const ReportInsights = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      await account.get();
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Sample data for charts
  const topIssuesData = [
    { issue: 'Political Misinformation', count: 245, verified: 89, unverified: 156 },
    { issue: 'Health Claims', count: 189, verified: 134, unverified: 55 },
    { issue: 'Climate Change', count: 167, verified: 142, unverified: 25 },
    { issue: 'Economic Reports', count: 134, verified: 98, unverified: 36 },
    { issue: 'Social Issues', count: 112, verified: 78, unverified: 34 }
  ];

  const verificationRatioData = [
    { name: 'Verified', value: 541, color: '#22c55e' },
    { name: 'Under Review', value: 89, color: '#f59e0b' },
    { name: 'Unverified/Fake', value: 306, color: '#ef4444' }
  ];

  const regionalData = [
    { region: 'North America', reports: 298, accuracy: 78 },
    { region: 'Europe', reports: 245, accuracy: 82 },
    { region: 'Asia', reports: 412, accuracy: 65 },
    { region: 'Africa', reports: 189, accuracy: 71 },
    { region: 'South America', reports: 156, accuracy: 69 },
    { region: 'Oceania', reports: 89, accuracy: 85 }
  ];

  const trendData = [
    { week: 'Week 1', verified: 145, fake: 89, total: 234 },
    { week: 'Week 2', verified: 167, fake: 76, total: 243 },
    { week: 'Week 3', verified: 189, fake: 98, total: 287 },
    { week: 'Week 4', verified: 203, fake: 67, total: 270 }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Report Insights
            </h1>
            <p className="text-xl md:text-2xl mb-6 text-blue-100">
              Deeper analysis of verified reports, incidents, and global patterns
            </p>
            <p className="text-lg max-w-3xl mx-auto text-blue-50">
              Welcome to Amniva's intelligence hub, where AI-powered analytics transform raw reports 
              into actionable insights. Discover trends, verify patterns, and understand the bigger 
              picture behind global information flows.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* User Submission & Insights Section (Only for authenticated users) */}
        {isAuthenticated && (
          <div className="mb-12">
            <Tabs defaultValue="submit" className="w-full">
              <TabsList className="grid w-full grid-cols-1 mb-6">
                <TabsTrigger value="submit">Submit Report</TabsTrigger>
              </TabsList>

              <TabsContent value="submit">
                <ReportSubmissionForm />
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        {/* AI-Powered Insights Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">AI-Powered Intelligence</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Insight Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  This week shows a 23% increase in health-related misinformation, primarily 
                  targeting vaccine safety claims. 67% of these reports originated from 
                  unverified social media accounts.
                </p>
                <div className="mt-4 text-sm text-gray-500">
                  Last updated: 2 hours ago
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-amber-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Root Cause Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Political tensions and upcoming elections are driving increased misinformation 
                  campaigns. Key vectors include coordinated bot networks and manipulated media content.
                </p>
                <div className="mt-4 text-sm text-gray-500">
                  Confidence Level: 89%
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Predicted Outcome
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Expected 15% surge in climate-related misinformation over the next 30 days, 
                  coinciding with upcoming climate summit. Recommend increased monitoring.
                </p>
                <div className="mt-4 text-sm text-gray-500">
                  Risk Level: Moderate
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Visual Analytics Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Visual Analytics</h2>
          
          <Tabs defaultValue="issues" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="issues">Top Issues</TabsTrigger>
              <TabsTrigger value="verification">Verification Ratio</TabsTrigger>
              <TabsTrigger value="regional">Regional Analysis</TabsTrigger>
              <TabsTrigger value="trends">Weekly Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="issues" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top 5 Reported Issues This Week</CardTitle>
                  <CardDescription>Issues by volume and verification status</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      verified: { label: "Verified", color: "#22c55e" },
                      unverified: { label: "Unverified", color: "#ef4444" }
                    }}
                    className="h-80"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topIssuesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="issue" angle={-45} textAnchor="end" height={100} />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="verified" fill="#22c55e" name="Verified" />
                        <Bar dataKey="unverified" fill="#ef4444" name="Unverified" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="verification" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Verified vs Unverified Content Ratios</CardTitle>
                  <CardDescription>Overall verification status of submitted reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      verified: { label: "Verified", color: "#22c55e" },
                      review: { label: "Under Review", color: "#f59e0b" },
                      unverified: { label: "Unverified", color: "#ef4444" }
                    }}
                    className="h-80"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={verificationRatioData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {verificationRatioData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="regional" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Frequency by Region</CardTitle>
                  <CardDescription>Report volume and accuracy rates by geographic region</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      reports: { label: "Reports", color: "#3b82f6" },
                      accuracy: { label: "Accuracy %", color: "#22c55e" }
                    }}
                    className="h-80"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={regionalData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="region" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="reports" fill="#3b82f6" name="Reports" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Verification Trends</CardTitle>
                  <CardDescription>Verified vs fake content trends over the past month</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      verified: { label: "Verified", color: "#22c55e" },
                      fake: { label: "Fake", color: "#ef4444" }
                    }}
                    className="h-80"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="verified" stroke="#22c55e" strokeWidth={3} />
                        <Line type="monotone" dataKey="fake" stroke="#ef4444" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Interactive Heat Map Placeholder */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Global Misinformation Heat Map</CardTitle>
              <CardDescription>Geographic trends in reporting and misinformation (Interactive map coming soon)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-r from-blue-100 to-green-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <div className="text-4xl mb-4">🌐</div>
                  <p className="text-lg font-semibold text-gray-700">Interactive Heat Map</p>
                  <p className="text-gray-500">Real-time geographic analysis coming soon</p>
                  <p className="text-sm text-gray-400 mt-2">Will integrate with live API data sources</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly/Monthly Briefs */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Intelligence Briefs</CardTitle>
              <CardDescription>Weekly and monthly summaries of key findings</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="verified" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="verified">Top Verified</TabsTrigger>
                  <TabsTrigger value="fake">Top Fake</TabsTrigger>
                  <TabsTrigger value="trends">Notable Trends</TabsTrigger>
                </TabsList>

                <TabsContent value="verified" className="mt-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                      <h4 className="font-semibold text-green-800">Climate Summit Agreements</h4>
                      <p className="text-sm text-green-700">Verified commitments from 15 nations on carbon reduction targets</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                      <h4 className="font-semibold text-green-800">Healthcare Policy Changes</h4>
                      <p className="text-sm text-green-700">Confirmed updates to national health insurance programs</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                      <h4 className="font-semibold text-green-800">Economic Recovery Data</h4>
                      <p className="text-sm text-green-700">Official GDP growth figures released by central banks</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="fake" className="mt-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                      <h4 className="font-semibold text-red-800">False Vaccine Claims</h4>
                      <p className="text-sm text-red-700">Debunked: Claims about vaccine microchips and tracking devices</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                      <h4 className="font-semibold text-red-800">Election Manipulation</h4>
                      <p className="text-sm text-red-700">Verified as false: Video showing ballot stuffing was staged</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                      <h4 className="font-semibold text-red-800">Climate Denial Content</h4>
                      <p className="text-sm text-red-700">Fake data about temperature records proven incorrect</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="trends" className="mt-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                      <h4 className="font-semibold text-blue-800">AI-Generated Content Rise</h4>
                      <p className="text-sm text-blue-700">67% increase in AI-generated fake news articles detected</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                      <h4 className="font-semibold text-blue-800">Cross-Platform Coordination</h4>
                      <p className="text-sm text-blue-700">Identified synchronized misinformation campaigns across 5+ platforms</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                      <h4 className="font-semibold text-blue-800">Fact-Check Resistance</h4>
                      <p className="text-sm text-blue-700">Growing trend of audiences rejecting fact-checking services</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* What to Do Next Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>What to Do Next</CardTitle>
            <CardDescription>Actionable recommendations based on current intelligence</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">For Public Safety Officials</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Monitor health misinformation spikes</li>
                  <li>• Prepare counter-narrative campaigns</li>
                  <li>• Coordinate with fact-checking partners</li>
                  <li>• Alert emergency response teams</li>
                </ul>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">For Journalists & Media</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Verify sources using Amniva tools</li>
                  <li>• Focus on climate misinformation stories</li>
                  <li>• Investigate coordinated inauthentic behavior</li>
                  <li>• Collaborate on fact-checking initiatives</li>
                </ul>
              </div>
              
              <div className="p-4 bg-amber-50 rounded-lg">
                <h3 className="font-semibold text-amber-800 mb-2">For Platform Moderators</h3>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Increase AI-generated content detection</li>
                  <li>• Flag coordinated campaigns early</li>
                  <li>• Implement stricter verification requirements</li>
                  <li>• Share intelligence with other platforms</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Intelligence Notice */}
        <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-indigo-800 mb-2">AI & Intelligence Integration</h3>
              <p className="text-indigo-700 mb-4">
                Our insights are powered by advanced AI analysis, real-time data feeds, and expert verification networks. 
                Results are continuously refined through machine learning and human oversight.
              </p>
              <div className="flex justify-center gap-4 text-sm text-indigo-600">
                <span>• Real-time API Integration</span>
                <span>• ML-Powered Pattern Recognition</span>
                <span>• Expert Human Verification</span>
                <span>• Cross-Platform Analysis</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportInsights;
