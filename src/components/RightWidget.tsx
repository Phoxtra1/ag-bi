
import React from 'react';
import SpotliteNewsFeed from './SpotliteNewsFeed';
import { Radio } from 'lucide-react';
import { Link } from 'react-router-dom';

const RightWidget = () => {
  return (
    <aside className="w-full lg:w-80 space-y-6">
      {/* AMNews Live Radio Section */}
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
              <span className="text-sm text-gray-600">Live Radio</span>
            </div>
          </div>
        </div>
        
        {/* Radio Player Interface */}
        <div className="bg-gradient-to-br from-red-50 to-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                <Radio className="h-8 w-8 text-white" />
              </div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-red-200 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
            </div>
          </div>
          <div className="text-center mb-3">
            <p className="text-sm font-medium text-gray-900 mb-1">Now Playing</p>
            <p className="text-xs text-gray-600">AMNews Radio - Live Stream</p>
          </div>
          
          {/* Landscape Audio Player */}
          <audio 
            controls 
            className="w-full h-10"
            src="https://stream.zeno.fm/m2wnv2cnyrhvv"
            preload="none"
          >
            Your browser does not support the audio element.
          </audio>
        </div>
        
        <p className="text-xs text-gray-500 mt-2">
          Live radio streaming from AMNews
        </p>
      </div>

      {/* Spotlite News Feed */}
      <SpotliteNewsFeed />
      
      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <Link to="/contact" className="block">
            <button className="w-full text-left p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <div className="text-sm font-medium text-blue-900">Submit Content</div>
              <div className="text-xs text-blue-700">Share news or insights</div>
            </button>
          </Link>
          <Link to="/verify" className="block">
            <button className="w-full text-left p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <div className="text-sm font-medium text-green-900">Verify Information</div>
              <div className="text-xs text-green-700">Check facts instantly</div>
            </button>
          </Link>
          <Link to="/predictions" className="block">
            <button className="w-full text-left p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <div className="text-sm font-medium text-purple-900">Make Prediction</div>
              <div className="text-xs text-purple-700">Share your forecast</div>
            </button>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default RightWidget;
