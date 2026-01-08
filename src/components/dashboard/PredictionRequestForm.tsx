import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser } from '@/lib/auth';
import { databases, storage, DATABASE_ID, PREDICTIONS_COLLECTION_ID } from '@/lib/appwrite';
import { ID } from 'appwrite';
import { 
  Upload, 
  FileText, 
  Image, 
  Video, 
  X, 
  TrendingUp,
  CloudSun,
  Building2,
  Vote,
  AlertTriangle,
  Scale,
  Loader2,
  CheckCircle
} from 'lucide-react';

const PREDICTION_BUCKET_ID = 'prediction-uploads';

type PredictionCategory = 
  | 'Environment' 
  | 'Weather & Climate' 
  | 'Disaster' 
  | 'Politics' 
  | 'Conflict' 
  | 'Crime' 
  | 'Business' 
  | 'Economy' 
  | 'Technology'
  | 'Health';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
}

const categoryIcons: Record<PredictionCategory, React.ReactNode> = {
  'Environment': <CloudSun className="w-4 h-4" />,
  'Weather & Climate': <CloudSun className="w-4 h-4" />,
  'Disaster': <AlertTriangle className="w-4 h-4" />,
  'Politics': <Vote className="w-4 h-4" />,
  'Conflict': <AlertTriangle className="w-4 h-4" />,
  'Crime': <Scale className="w-4 h-4" />,
  'Business': <Building2 className="w-4 h-4" />,
  'Economy': <TrendingUp className="w-4 h-4" />,
  'Technology': <TrendingUp className="w-4 h-4" />,
  'Health': <AlertTriangle className="w-4 h-4" />,
};

const categoryDescriptions: Record<PredictionCategory, string> = {
  'Environment': 'Deforestation, pollution, ecosystem changes',
  'Weather & Climate': 'Seasonal forecasts, climate patterns, extreme events',
  'Disaster': 'Natural disasters, risk assessment, preparedness',
  'Politics': 'Elections, policy impacts, regional stability',
  'Conflict': 'Regional tensions, security threats, peacekeeping',
  'Crime': 'Crime patterns, security analysis, prevention',
  'Business': 'Market trends, industry outlook, investments',
  'Economy': 'Economic indicators, currency trends, trade',
  'Technology': 'Innovation trends, digital adoption, disruption',
  'Health': 'Disease patterns, health trends, epidemiology',
};

const ALLOWED_FILE_TYPES = [
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  // Images
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  // Videos
  'video/mp4',
  'video/webm',
  'video/quicktime',
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const PredictionRequestForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [category, setCategory] = useState<PredictionCategory | ''>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [region, setRegion] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles: UploadedFile[] = [];
    
    Array.from(files).forEach(file => {
      // Validate file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        toast({
          title: 'Invalid file type',
          description: `${file.name} is not a supported file type.`,
          variant: 'destructive'
        });
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: 'File too large',
          description: `${file.name} exceeds the 50MB limit.`,
          variant: 'destructive'
        });
        return;
      }

      newFiles.push({
        id: ID.unique(),
        name: file.name,
        size: file.size,
        type: file.type,
        file
      });
    });

    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (type.startsWith('video/')) return <Video className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !title || !description) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in category, title, and description.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      const user = await getCurrentUser();
      if (!user) {
        toast({
          title: 'Authentication required',
          description: 'Please sign in to submit a prediction request.',
          variant: 'destructive'
        });
        setLoading(false);
        return;
      }

      // Upload files first
      const uploadedFileIds: string[] = [];
      const uploadedFileNames: string[] = [];

      for (const uploadedFile of uploadedFiles) {
        try {
          const fileResult = await storage.createFile(
            PREDICTION_BUCKET_ID,
            ID.unique(),
            uploadedFile.file
          );
          uploadedFileIds.push(fileResult.$id);
          uploadedFileNames.push(uploadedFile.name);
        } catch (uploadError: any) {
          console.error('File upload error:', uploadError);
          // Continue with other files even if one fails
          toast({
            title: 'File upload warning',
            description: `Could not upload ${uploadedFile.name}. Continuing with submission.`,
            variant: 'destructive'
          });
        }
      }

      // Create prediction document
      await databases.createDocument(
        DATABASE_ID,
        PREDICTIONS_COLLECTION_ID,
        ID.unique(),
        {
          name: user.name || user.email.split('@')[0],
          email: user.email,
          userId: user.$id,
          category,
          title,
          description,
          region: region || 'Global',
          timeframe: timeframe || 'Not specified',
          status: 'pending',
          submittedAt: new Date().toISOString(),
          fileIds: uploadedFileIds.join(','),
          fileNames: uploadedFileNames.join(','),
          fileCount: uploadedFileIds.length
        }
      );

      setSubmitted(true);
      toast({
        title: 'Prediction request submitted',
        description: 'Your request has been sent for analysis. You will receive results via email.',
      });

      // Reset form
      setCategory('');
      setTitle('');
      setDescription('');
      setRegion('');
      setTimeframe('');
      setUploadedFiles([]);

      if (onSuccess) onSuccess();

      // Reset submitted state after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);

    } catch (error: any) {
      console.error('Error submitting prediction:', error);
      toast({
        title: 'Submission failed',
        description: error.message || 'Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
          <h3 className="text-xl font-semibold mb-2">Request Submitted Successfully!</h3>
          <p className="text-muted-foreground mb-4">
            Your prediction request is being processed by our AI engines.
            You will receive the analysis results via email.
          </p>
          <Button onClick={() => setSubmitted(false)}>
            Submit Another Request
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Request Prediction
        </CardTitle>
        <CardDescription>
          Submit data or information for AI-powered predictive analysis across multiple categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category">Prediction Category *</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as PredictionCategory)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(categoryDescriptions) as PredictionCategory[]).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    <div className="flex items-center gap-2">
                      {categoryIcons[cat]}
                      <span>{cat}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {category && (
              <p className="text-sm text-muted-foreground">
                {categoryDescriptions[category]}
              </p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Prediction Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Q1 2026 Ghana Election Outlook"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you want to predict or analyze. Include relevant context, historical data points, and specific questions you need answered..."
              rows={5}
            />
          </div>

          {/* Region & Timeframe */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="region">Region/Location</Label>
              <Input
                id="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="e.g., West Africa, Ghana, Global"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeframe">Prediction Timeframe</Label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-week">1 Week</SelectItem>
                  <SelectItem value="1-month">1 Month</SelectItem>
                  <SelectItem value="3-months">3 Months</SelectItem>
                  <SelectItem value="6-months">6 Months</SelectItem>
                  <SelectItem value="1-year">1 Year</SelectItem>
                  <SelectItem value="long-term">Long-term (2+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>Supporting Documents (Optional)</Label>
            <div 
              className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, DOC, CSV, Images, Videos (Max 50MB each)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={ALLOWED_FILE_TYPES.join(',')}
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2 mt-4">
                <p className="text-sm font-medium">Uploaded Files ({uploadedFiles.length})</p>
                <div className="space-y-2">
                  {uploadedFiles.map(file => (
                    <div 
                      key={file.id} 
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.type)}
                        <div>
                          <p className="text-sm font-medium truncate max-w-[200px]">
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Category Info */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm font-medium mb-2">Available Prediction Categories:</p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(categoryIcons) as PredictionCategory[]).map(cat => (
                <Badge key={cat} variant="outline" className="text-xs">
                  {categoryIcons[cat]}
                  <span className="ml-1">{cat}</span>
                </Badge>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting Request...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4 mr-2" />
                Submit Prediction Request
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PredictionRequestForm;
