import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Sidebar, superAdminMenu } from "../../components/layout/sidebar";
import { useToast } from "../../hooks/use-toast";

export default function ActivityLogs() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [exportFormat, setExportFormat] = useState("csv");
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterUser, setFilterUser] = useState("all");
  const [filterActivity, setFilterActivity] = useState("all");

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Fetch logs from API
  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/log', {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }

      const result = await response.json();
      setLogs(result.data || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast({
        title: "Error",
        description: "Gagal mengambil data log aktivitas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleDetailClick = (log) => {
    setSelectedLog(log);
    setShowDetailDialog(true);
  };

  const handleExport = () => {
    // Implement export functionality
    console.log(`Exporting to ${exportFormat}...`);
    toast({
      title: "Info",
      description: `Fitur ekspor ke ${exportFormat} akan segera tersedia`,
    });
  };

  // Filter logs based on search and filters
  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchQuery === "" || 
      log.aktivitas?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.username?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesUser = filterUser === "all" || 
      (filterUser === "admin" && log.role_id === 3) ||
      (filterUser === "headmaster" && log.role_id === 4) ||
      (filterUser === "parent" && log.role_id === 2);
    
    const matchesActivity = filterActivity === "all" || 
      log.aktivitas?.toLowerCase().includes(filterActivity.toLowerCase());
    
    return matchesSearch && matchesUser && matchesActivity;
  });

  // Get role name from role_id
  const getRoleName = (roleId) => {
    switch (roleId) {
      case 1: return "Super Admin";
      case 2: return "Orang Tua";
      case 3: return "Admin TU";
      case 4: return "Kepala Sekolah";
      default: return "Unknown";
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "-";
    const date = new Date(timestamp);
    return date.toLocaleString('id-ID');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar menu={superAdminMenu} />
        <div className="flex-1 flex flex-col">
          <div className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Memuat log aktivitas...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar menu={superAdminMenu} />
      <div className="flex-1 flex flex-col">
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Log Aktivitas</h1>
                <p className="text-muted-foreground">Catatan aktivitas pengguna dalam sistem</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6 space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Cari aktivitas..."
                  className="h-10 w-full rounded-md border px-4"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={filterUser} onValueChange={setFilterUser}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter User" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua User</SelectItem>
                  <SelectItem value="admin">Admin TU</SelectItem>
                  <SelectItem value="headmaster">Kepala Sekolah</SelectItem>
                  <SelectItem value="parent">Orang Tua</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterActivity} onValueChange={setFilterActivity}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Jenis Aktivitas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Aktivitas</SelectItem>
                  <SelectItem value="login">Login/Logout</SelectItem>
                  <SelectItem value="crud">CRUD Data</SelectItem>
                  <SelectItem value="verify">Verifikasi</SelectItem>
                  <SelectItem value="status">Perubahan Status</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleExport}>Ekspor</Button>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-4 text-left">Waktu</th>
                    <th className="p-4 text-left">User</th>
                    <th className="p-4 text-left">Role</th>
                    <th className="p-4 text-left">Aktivitas</th>
                    <th className="p-4 text-left">IP Address</th>
                    <th className="p-4 text-left">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-4 text-center text-muted-foreground">
                        Tidak ada data log aktivitas
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr key={log.log_id} className="border-b">
                        <td className="p-4">{formatTimestamp(log.timestamp)}</td>
                        <td className="p-4">{log.username || "-"}</td>
                        <td className="p-4">{getRoleName(log.role_id)}</td>
                        <td className="p-4">{log.aktivitas || "-"}</td>
                        <td className="p-4">{log.ip_address || "-"}</td>
                      <td className="p-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDetailClick(log)}
                        >
                          Detail
                        </Button>
                      </td>
                    </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detail Dialog */}
          <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Detail Log Aktivitas</DialogTitle>
              </DialogHeader>
              {selectedLog && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Waktu</label>
                      <p className="text-sm">{formatTimestamp(selectedLog.timestamp)}</p>
                      </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">User</label>
                      <p className="text-sm">{selectedLog.username || "-"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Role</label>
                      <p className="text-sm">{getRoleName(selectedLog.role_id)}</p>
                      </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">IP Address</label>
                      <p className="text-sm">{selectedLog.ip_address || "-"}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Aktivitas</label>
                    <p className="text-sm">{selectedLog.aktivitas || "-"}</p>
                  </div>
                  {selectedLog.details && (
                  <div>
                      <label className="text-sm font-medium text-muted-foreground">Detail Tambahan</label>
                      <p className="text-sm">{selectedLog.details}</p>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
} 