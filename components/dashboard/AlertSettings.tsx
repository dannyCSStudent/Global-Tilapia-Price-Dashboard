import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AlertSetting {
  threshold: number;
  isAbove: boolean;
}

const CustomAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertSetting[]>([]);
  const [threshold, setThreshold] = useState<string>('');
  const [isAbove, setIsAbove] = useState<boolean>(true);

  const addAlert = () => {
    const numThreshold = parseFloat(threshold);
    if (!isNaN(numThreshold)) {
      setAlerts([...alerts, { threshold: numThreshold, isAbove }]);
      setThreshold('');
    }
  };

  const removeAlert = (index: number) => {
    setAlerts(alerts.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Price Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            placeholder="Set price threshold"
          />
          <select
            value={isAbove ? 'above' : 'below'}
            onChange={(e) => setIsAbove(e.target.value === 'above')}
            className="border rounded p-2"
          >
            <option value="above">Above</option>
            <option value="below">Below</option>
          </select>
          <Button onClick={addAlert}>Add Alert</Button>
        </div>
        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <Alert key={index}>
              <AlertTitle>Price Alert</AlertTitle>
              <AlertDescription>
                Alert when price goes {alert.isAbove ? 'above' : 'below'} ${alert.threshold.toFixed(2)}
                <Button variant="outline" size="sm" className="ml-2" onClick={() => removeAlert(index)}>
                  Remove
                </Button>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomAlerts;
