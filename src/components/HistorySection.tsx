
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FolderOpen, Calendar } from "lucide-react";

const HistorySection = () => {
  // Mock history data with project information
  const mockHistorySessions = [
    {
      id: "1",
      name: "E-commerce Platform Requirements",
      date: "2 hours ago",
      project: "E-commerce Platform",
      agent: "SwiftPlan Requirements Analyst"
    },
    {
      id: "2", 
      name: "Mobile App Testing Strategy",
      date: "1 day ago",
      project: "Mobile Banking App",
      agent: "SwiftTest Automated Generator"
    },
    {
      id: "3",
      name: "API Documentation Review", 
      date: "3 days ago",
      project: "Task Management System",
      agent: "Swift Dev Backend Specialist"
    }
  ];

  return (
    <Card className="bg-custom-bg">
      <CardHeader>
        <CardTitle>Recent Sessions</CardTitle>
        <CardDescription>Your previous AI processing sessions with project information</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Session Name</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockHistorySessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell className="font-medium">{session.name}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <FolderOpen className="h-4 w-4 text-blue-500" />
                    <span>{session.project}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{session.agent}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">{session.date}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default HistorySection;
