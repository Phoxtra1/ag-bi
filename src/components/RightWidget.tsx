
import React from 'react';
import SpotliteNewsFeed from './SpotliteNewsFeed';
import RealTimeVideoPlayer from './RealTimeVideoPlayer';

const RightWidget = () => {
  return (
    <aside className="w-full lg:w-80 space-y-6">
      {/* AMNews Live Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <img 
            src="/lovable-uploads/a2e4a86e-128d-4262-8b13-16c3e14fb4be.png" 
            alt="AMNews Live Logo" 
            className="h-8 w-8"
          />
          <div>
            <h3 className="text-lg font-bold text-gray-900">AMNews Live</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live Streaming</span>
            </div>
          </div>
        </div>
        
        <RealTimeVideoPlayer />
        
        <p className="text-xs text-gray-500 mt-2">
          Real-time updates and live coverage from AMNews World
        </p>
      </div>

      {/* Spotlite News Feed */}
      <SpotliteNewsFeed />
      
      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <button className="w-full text-left p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <div className="text-sm font-medium text-blue-900">Submit Content</div>
            <div className="text-xs text-blue-700">Share news or insights</div>
          </button>
          <button className="w-full text-left p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <div className="text-sm font-medium text-green-900">Verify Information</div>
            <div className="text-xs text-green-700">Check facts instantly</div>
          </button>
          <button className="w-full text-left p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <div className="text-sm font-medium text-purple-900">Make Prediction</div>
            <div className="text-xs text-purple-700">Share your forecast</div>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default RightWidget;
