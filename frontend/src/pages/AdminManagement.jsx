import { useState, useEffect } from 'react';
import { 
  getMembers, 
  updateMemberStatus, 
  getAdminListings, 
  updateListingStatus, 
  deleteListing,
  checkAuth,
  getRegisterOptions,
  verifyRegister,
  resolveListingReport,
  deleteMember
} from '../api';
import { motion } from 'framer-motion';
import { startRegistration } from '@simplewebauthn/browser';
import { 
  Check, 
  X, 
  Download, 
  Mail, 
  Phone, 
  BookOpen, 
  Trash2, 
  Fingerprint,
  Users,
  Home,
  CheckCircle2,
  Eye,
  ShieldAlert,
  Archive,
  ChevronLeft,
  ChevronRight,
  Info,
  RefreshCw
} from 'lucide-react';

export default function AdminManagement() {
  const [members, setMembers] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('members'); // 'members' or 'housing'
  const [isPasskeySetup, setIsPasskeySetup] = useState(true);
  const [passkeySetupState, setPasskeySetupState] = useState({ loading: false });

  // Housing Moderation States
  const [housingSubTab, setHousingSubTab] = useState('pending');
  const [selectedListing, setSelectedListing] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionListingId, setRejectionListingId] = useState(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [reportsListing, setReportsListing] = useState(null);

  useEffect(() => {
    fetchData();
    checkAuth()
      .then(data => {
        setIsPasskeySetup(data.passkeyRegistered);
      })
      .catch(console.error);
  }, []);

  const fetchData = async () => {
    try {
      const data = await getMembers();
      setMembers(data);

      const listingData = await getAdminListings();
      setListings(listingData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    setMembers(members.map(m => m._id === id ? { ...m, status } : m));
    try {
      await updateMemberStatus(id, status);
    } catch (err) {
      console.error(err);
      fetchData();
    }
  };

  const handleListingStatusChangeWithReason = async (id, status, reason = '') => {
    setListings(listings.map(l => l._id === id ? { ...l, status, rejectionReason: reason } : l));
    try {
      await updateListingStatus(id, status, reason);
      fetchData();
    } catch (err) {
      console.error(err);
      fetchData();
    }
  };

  const handleListingDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this listing?')) return;
    try {
      await deleteListing(id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolveReports = async (id, action) => {
    try {
      await resolveListingReport(id, action);
      fetchData();
      setShowReportsModal(false);
      setReportsListing(null);
    } catch (err) {
      console.error(err);
      alert('Failed to resolve reports.');
    }
  };

  const handleDeleteMember = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this member registration? This will revoke all their posting access!')) return;
    try {
      await deleteMember(id);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to delete member.');
    }
  };

  const downloadCSV = () => {
    const headers = ['Name,Email,Roll Number,Department,Year,Contact,Home District,Blood Group,Gender,Status,Joined'];
    const rows = members.map(m => 
      `"${m.name}","${m.email}","${m.rollNumber || 'N/A'}","${m.department}","${m.year}","${m.contact}","${m.homeDistrict || 'Assam'}","${m.bloodGroup || 'O+'}","${m.gender || 'Male'}","${m.status}","${new Date(m.joinedDate).toLocaleDateString()}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "asf_members_registry.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRegisterPasskey = async () => {
    try {
      setPasskeySetupState({ loading: true });
      const options = await getRegisterOptions();
      const registrationResponse = await startRegistration({ optionsJSON: options });
      const verification = await verifyRegister(registrationResponse);
      
      if (verification.verified) {
        setIsPasskeySetup(true);
        alert('Passkey successfully registered! Password login has been disabled for your security.');
      } else {
        alert('Passkey verification failed.');
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Passkey registration failed or cancelled.');
    } finally {
      setPasskeySetupState({ loading: false });
    }
  };

  // Filter lists
  const pendingMembers = members.filter(m => m.status === 'pending');
  const approvedMembers = members.filter(m => m.status === 'active');

  const pendingListings = listings.filter(l => l.status === 'pending');
  const approvedListings = listings.filter(l => l.status === 'approved');

  return (
    <div className="space-y-6 pb-20">
      {/* Header Area */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#d8dee4]">
        <div>
          <h1 className="text-2xl font-semibold text-[#24292f] tracking-tight">Admin Moderation Workspace</h1>
          <p className="text-xs text-[#57606a] mt-1">Review student registry applications and housing marketplace proposals.</p>
        </div>
        <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
          <button 
            onClick={fetchData}
            disabled={loading}
            className="bg-[#f6f8fa] hover:bg-[#f3f4f6] text-[#24292f] border border-[#d0d7de] py-1.5 px-3 rounded-md font-semibold text-xs shadow-sm transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            title="Refresh database"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          {activeTab === 'members' && (
            <button 
              onClick={downloadCSV} 
              className="bg-[#f6f8fa] hover:bg-[#f3f4f6] text-[#24292f] border border-[#d0d7de] py-1.5 px-3 rounded-md font-semibold text-xs shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Download size={14} />
              Export Registry
            </button>
          )}
        </div>
      </header>

      {/* Warning/Biometrics Registration Banner */}
      {!isPasskeySetup && (
        <div className="p-4 bg-[#fff8c5] border border-[#d4a72c]/30 rounded-md text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[#735c0f]">
          <div>
            <h4 className="font-semibold">Passkey Security Setup Pending</h4>
            <p className="text-slate-600 mt-0.5 leading-relaxed">
              Secure your admin account with Touch ID, Face ID, or Windows Hello to deactivate password-based access.
            </p>
          </div>
          <button
            onClick={handleRegisterPasskey}
            disabled={passkeySetupState.loading}
            className="bg-[#2da44e] hover:bg-[#2c974b] text-white py-1.5 px-3 border border-[rgba(27,31,36,0.15)] rounded-md font-semibold text-xs shadow-sm transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Fingerprint size={14} />
            {passkeySetupState.loading ? 'Registering...' : 'Register Passkey'}
          </button>
        </div>
      )}

      {/* Tabs Selector */}
      <div className="flex border-b border-[#d8dee4] pb-px gap-6 mb-6">
        <button
          onClick={() => setActiveTab('members')}
          className={`pb-3 text-xs font-semibold tracking-wide relative cursor-pointer transition-colors ${
            activeTab === 'members' ? 'text-[#24292f] border-b-2 border-[#fd8c73] font-bold' : 'text-[#57606a] hover:text-[#24292f]'
          }`}
        >
          Student Registry Queue ({pendingMembers.length})
        </button>
        <button
          onClick={() => setActiveTab('housing')}
          className={`pb-3 text-xs font-semibold tracking-wide relative cursor-pointer transition-colors ${
            activeTab === 'housing' ? 'text-[#24292f] border-b-2 border-[#fd8c73] font-bold' : 'text-[#57606a] hover:text-[#24292f]'
          }`}
        >
          Housing Approvals ({pendingListings.length})
        </button>
      </div>

      {activeTab === 'members' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Pending Applications - Left Column */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xs font-semibold text-[#24292f] uppercase tracking-wider">Entrance Queue</h3>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 bg-white rounded-md border border-[#d8dee4]">
                <div className="w-6 h-6 border-2 border-[#0969da] border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="text-xs text-[#57606a]">Accessing Secure Database...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingMembers.length === 0 && (
                  <div className="p-12 text-center bg-white rounded-md border border-[#d8dee4] text-[#57606a] text-xs italic">
                    No pending student enrollment applications.
                  </div>
                )}
                {pendingMembers.map((app) => (
                  <div 
                    key={app._id} 
                    className="bg-white border border-[#d8dee4] rounded-md shadow-sm p-4 space-y-4"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#24292f] text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                          {app.name.substring(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-[#24292f]">{app.name}</h4>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-[#f6f8fa] text-[#57606a] border border-[#d8dee4] mt-0.5">
                            {app.department}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => handleStatusChange(app._id, 'active')} 
                          className="p-1.5 bg-[#dafbe1] text-[#1a7f37] hover:bg-[#2da44e] hover:text-white rounded-md border border-[#aef1b9] transition-colors cursor-pointer"
                          title="Approve Member"
                        >
                          <Check size={16} />
                        </button>
                        <button 
                          onClick={() => handleStatusChange(app._id, 'rejected')} 
                          className="p-1.5 bg-[#ffebe9] text-[#cf222e] hover:bg-[#cf222e] hover:text-white rounded-md border border-[#ffc1c0] transition-colors cursor-pointer"
                          title="Reject Application"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 pt-3 border-t border-[#f6f8fa] text-xs text-[#57606a]">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Mail size={13} className="shrink-0" />
                        <span className="truncate" title={app.email}>{app.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone size={13} className="shrink-0" />
                        <span>{app.contact}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BookOpen size={13} className="shrink-0" />
                        <span>{app.year}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-bold text-[#57606a] border border-[#d8dee4] px-1 rounded uppercase">Roll</span>
                        <span className="truncate">{app.rollNumber}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-bold text-[#57606a] border border-[#d8dee4] px-1 rounded uppercase">Town</span>
                        <span className="truncate">{app.homeDistrict}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-bold text-[#cf222e] border border-[#ffc1c0] px-1 rounded uppercase">Blood</span>
                        <span>{app.bloodGroup} ({app.gender})</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Approved Members List - Right Column */}
          <aside className="lg:col-span-5 space-y-4">
            <h3 className="text-xs font-semibold text-[#24292f] uppercase tracking-wider">Approved Registry</h3>
            <div className="bg-white border border-[#d8dee4] rounded-md shadow-sm overflow-hidden">
              <div className="p-3 bg-[#f6f8fa] border-b border-[#d8dee4] flex items-center gap-1.5 text-xs text-[#24292f] font-semibold">
                <Users size={14} className="text-[#57606a]" />
                <span>Verified Forum Database</span>
              </div>
              
              <div className="divide-y divide-[#d8dee4] max-h-[500px] overflow-y-auto">
                {approvedMembers.length === 0 ? (
                  <p className="p-4 text-xs text-[#57606a] italic">No active approved profiles yet.</p>
                ) : (
                  approvedMembers.map((m) => (
                    <div 
                      key={m._id} 
                      className="p-3 hover:bg-[#f6f8fa]/50 transition-colors flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 bg-[#f6f8fa] border border-[#d8dee4] text-[#24292f] rounded-full flex items-center justify-center font-bold text-[10px]">
                          {m.name.substring(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-[#24292f]">{m.name}</p>
                          <p className="text-[10px] text-[#57606a]">{m.department}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[9px] text-[#1a7f37] bg-[#dafbe1] border border-[#aef1b9] px-1.5 py-0.5 rounded-full font-semibold">
                          Active
                        </span>
                        <button
                          onClick={() => handleStatusChange(m._id, 'rejected')}
                          className="p-1 hover:bg-[#ffebe9] text-[#cf222e] rounded border border-transparent hover:border-[#ffc1c0] transition-colors cursor-pointer"
                          title="Suspend Membership"
                        >
                          <X size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteMember(m._id)}
                          className="p-1 hover:bg-[#ffebe9] text-[#cf222e] rounded border border-transparent hover:border-[#ffc1c0] transition-colors cursor-pointer"
                          title="Delete Member"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Moderation Metrics Roster */}
          <div className="flex flex-wrap gap-2 border-b border-[#d8dee4] pb-4">
            {[
              { id: 'pending', label: 'Pending Approvals', count: listings.filter(l => l.status === 'pending').length },
              { id: 'approved', label: 'Approved & Live', count: listings.filter(l => l.status === 'approved').length },
              { id: 'rejected', label: 'Rejected', count: listings.filter(l => l.status === 'rejected').length },
              { id: 'reported', label: 'Reported Ads', count: listings.filter(l => l.reports && l.reports.length > 0).length, color: 'text-red-650' },
              { id: 'expired', label: 'Expired', count: listings.filter(l => l.status === 'expired').length },
              { id: 'archived', label: 'Archived', count: listings.filter(l => l.status === 'archived' || l.status === 'suspended').length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setHousingSubTab(tab.id)}
                className={`px-4 py-2 text-xs font-semibold rounded-md border tracking-wide transition-all cursor-pointer ${
                  housingSubTab === tab.id
                    ? 'bg-[#24292f] text-white border-[#24292f]'
                    : 'bg-white text-[#57606a] border-[#d8dee4] hover:bg-[#f6f8fa]'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Moderation Listing Board */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 bg-white rounded-md border border-[#d8dee4]">
                <div className="w-6 h-6 border-2 border-[#0969da] border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="text-xs text-[#57606a]">Loading listings database...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {listings
                  .filter(l => {
                    if (housingSubTab === 'reported') return l.reports && l.reports.length > 0;
                    if (housingSubTab === 'archived') return l.status === 'archived' || l.status === 'suspended';
                    return l.status === housingSubTab;
                  })
                  .map((item) => {
                    const hasReports = item.reports && item.reports.length > 0;
                    return (
                      <div
                        key={item._id}
                        className="bg-white border border-[#d8dee4] rounded-md shadow-sm p-5 flex flex-col justify-between space-y-4 hover:border-[#adbac7] transition-all"
                      >
                        <div className="space-y-3">
                          <div className="flex justify-between items-start gap-4">
                            <span className="px-2 py-0.5 bg-[#f6f8fa] text-[#24292f] border border-[#d8dee4] rounded text-[10px] font-semibold uppercase">
                              {item.category}
                            </span>
                            
                            <div className="flex items-center gap-1.5">
                              {hasReports && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#ffebe9] text-[#cf222e] border border-[#ffc1c0]">
                                  <ShieldAlert size={12} />
                                  {item.reports.length} Reports
                                </span>
                              )}
                              <span className="text-[10px] text-[#57606a] font-medium">
                                {item.views || 0} views
                              </span>
                            </div>
                          </div>

                          <h4 className="font-semibold text-[#24292f] text-sm leading-snug">
                            {item.title}
                          </h4>

                          <p className="text-xs text-[#57606a]">
                            Location: {item.address}, {item.village} • Rent: ₹{item.rent}/mo
                          </p>

                          <div className="border-t border-[#f6f8fa] pt-2 text-[10px] text-[#57606a] space-y-1">
                            <div>Owner: {item.ownerName} ({item.phone})</div>
                            <div>Submitter: {item.userEmail}</div>
                          </div>

                          {item.rejectionReason && item.status === 'rejected' && (
                            <div className="p-2.5 bg-[#f6f8fa] border rounded text-[10px] text-[#57606a] font-mono whitespace-pre-line">
                              <strong>Rejection reason:</strong> {item.rejectionReason}
                            </div>
                          )}
                        </div>

                        {/* Control Actions Row */}
                        <div className="border-t border-[#f6f8fa] pt-3 flex flex-wrap items-center gap-1.5 justify-end text-[10px] font-semibold">
                          <button
                            onClick={() => {
                              setSelectedListing(item);
                            }}
                            className="px-2.5 py-1.5 bg-[#f6f8fa] text-[#24292f] hover:bg-[#ebecf0] border border-[#d8dee4] rounded-md transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Eye size={12} />
                            Preview
                          </button>

                          {hasReports && (
                            <button
                              onClick={() => {
                                setReportsListing(item);
                                setShowReportsModal(true);
                              }}
                              className="px-2.5 py-1.5 bg-[#ffebe9] text-[#cf222e] hover:bg-[#cf222e] hover:text-white border border-[#ffc1c0] rounded-md transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <ShieldAlert size={12} />
                              Review Reports
                            </button>
                          )}

                          {item.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleListingStatusChangeWithReason(item._id, 'approved')}
                                className="px-2.5 py-1.5 bg-[#dafbe1] text-[#1a7f37] hover:bg-[#2da44e] hover:text-white border border-[#aef1b9] rounded-md transition-colors cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => {
                                  setRejectionListingId(item._id);
                                  setShowRejectModal(true);
                                }}
                                className="px-2.5 py-1.5 bg-[#ffebe9] text-[#cf222e] hover:bg-[#cf222e] hover:text-white border border-[#ffc1c0] rounded-md transition-colors cursor-pointer"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {(item.status === 'approved' || item.status === 'expired') && (
                            <button
                              onClick={() => handleListingStatusChangeWithReason(item._id, 'archived')}
                              className="px-2.5 py-1.5 bg-[#f6f8fa] text-[#57606a] border border-[#d8dee4] hover:bg-[#ebecf0] rounded-md transition-colors cursor-pointer"
                            >
                              Archive
                            </button>
                          )}

                          {(item.status === 'rejected' || item.status === 'archived' || item.status === 'suspended') && (
                            <button
                              onClick={() => handleListingStatusChangeWithReason(item._id, 'pending')}
                              className="px-2.5 py-1.5 bg-[#ddf4ff] text-[#0969da] border border-[#b4e1fa] hover:bg-[#0969da] hover:text-white rounded-md transition-colors cursor-pointer"
                            >
                              Restore
                            </button>
                          )}

                          <button
                            onClick={() => handleListingDelete(item._id)}
                            className="p-1.5 bg-[#ffebe9] text-[#cf222e] hover:bg-[#cf222e] hover:text-white border border-[#ffc1c0] rounded-md transition-colors cursor-pointer"
                            title="Delete permanently"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                {listings.filter(l => {
                  if (housingSubTab === 'reported') return l.reports && l.reports.length > 0;
                  if (housingSubTab === 'archived') return l.status === 'archived' || l.status === 'suspended';
                  return l.status === housingSubTab;
                }).length === 0 && (
                  <div className="col-span-full p-12 text-center bg-white border border-[#d8dee4] text-[#57606a] text-xs italic">
                    No listings catalogued in this section.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Detailed Preview Modal */}
          {selectedListing && (
            <div className="fixed inset-0 z-50 bg-[#24292f]/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6 relative border border-[#d8dee4] shadow-lg text-xs space-y-4">
                <button
                  onClick={() => setSelectedListing(null)}
                  className="absolute top-4 right-4 p-1 hover:bg-[#f6f8fa] border rounded-md"
                >
                  <X size={15} />
                </button>

                <h3 className="font-semibold text-sm text-[#24292f] border-b pb-2">Listing Detail Preview</h3>

                <div className="space-y-2">
                  <h4 className="font-bold text-base text-[#24292f]">{selectedListing.title}</h4>
                  <p className="text-[#57606a]">{selectedListing.address}, {selectedListing.village} {selectedListing.landmark && `(Near ${selectedListing.landmark})`}</p>
                </div>

                {/* Images */}
                {selectedListing.images && selectedListing.images.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {selectedListing.images.map((img, idx) => (
                      <div key={idx} className="h-24 rounded border overflow-hidden">
                        <img src={img} alt="Property" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="italic text-[#57606a] bg-[#f6f8fa] p-3 rounded">No images uploaded.</p>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#f6f8fa] p-3 border rounded text-[#24292f]">
                    <strong>Monthly Rent:</strong> ₹{selectedListing.rent}/mo<br />
                    <strong>Deposit:</strong> ₹{selectedListing.deposit || 0}<br />
                    <strong>Availability:</strong> {selectedListing.availableFrom ? new Date(selectedListing.availableFrom).toLocaleDateString() : 'Immediate'}
                  </div>
                  <div className="bg-[#f6f8fa] p-3 border rounded text-[#24292f]">
                    <strong>Category:</strong> {selectedListing.category}<br />
                    <strong>Sharing Type:</strong> {selectedListing.sharingType}<br />
                    <strong>Gender Preference:</strong> {selectedListing.genderPreference}
                  </div>
                </div>

                <div className="space-y-1">
                  <strong>Description:</strong>
                  <p className="p-3 bg-[#f6f8fa] rounded text-[#57606a] leading-relaxed whitespace-pre-line">
                    {selectedListing.description || 'No description provided.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <strong>Amenities:</strong>
                    <div className="flex flex-wrap gap-1">
                      {selectedListing.amenities && selectedListing.amenities.length > 0 ? (
                        selectedListing.amenities.map(a => (
                          <span key={a} className="px-1.5 py-0.5 bg-[#f6f8fa] text-[#24292f] rounded border text-[9px]">{a}</span>
                        ))
                      ) : (
                        <span className="text-[#57606a] italic">None</span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <strong>House Rules:</strong>
                    <ul className="list-disc list-inside text-[#57606a]">
                      {selectedListing.rules && selectedListing.rules.length > 0 ? (
                        selectedListing.rules.map((r, i) => <li key={i}>{r}</li>)
                      ) : (
                        <li className="italic">None specified</li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="bg-[#f6f8fa] p-3 border rounded space-y-1 text-[#24292f]">
                  <strong>Owner Profile & Verification:</strong>
                  <div>Owner Name: {selectedListing.ownerName}</div>
                  <div>Contact phone: {selectedListing.phone} | WhatsApp: {selectedListing.whatsapp || 'N/A'}</div>
                  <div>Registered Student: {selectedListing.userEmail}</div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setSelectedListing(null)}
                    className="px-4 py-2 bg-[#24292f] text-white hover:bg-[#1f2428] rounded font-bold cursor-pointer"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Rejection Feedback Reason Modal */}
          {showRejectModal && (
            <div className="fixed inset-0 z-50 bg-[#24292f]/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-lg w-full max-w-sm p-6 relative border border-[#d8dee4] shadow-lg text-xs space-y-4">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionListingId(null);
                    setRejectionReasonInput('');
                  }}
                  className="absolute top-4 right-4 p-1 hover:bg-[#f6f8fa] border rounded-md"
                >
                  <X size={15} />
                </button>

                <h3 className="font-semibold text-sm text-[#24292f]">Specify Rejection Feedback</h3>
                <p className="text-[#57606a]">Provide the student with a reason why this listing was rejected (e.g. incorrect phone number, duplicate photos).</p>

                <textarea
                  rows="3"
                  className="w-full p-2 border rounded focus:border-[#0969da] outline-none resize-none font-sans"
                  placeholder="Enter rejection explanation details..."
                  value={rejectionReasonInput}
                  onChange={(e) => setRejectionReasonInput(e.target.value)}
                />

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRejectModal(false);
                      setRejectionListingId(null);
                      setRejectionReasonInput('');
                    }}
                    className="px-3.5 py-2 border rounded font-semibold hover:bg-[#f6f8fa]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleListingStatusChangeWithReason(rejectionListingId, 'rejected', rejectionReasonInput);
                      setShowRejectModal(false);
                      setRejectionListingId(null);
                      setRejectionReasonInput('');
                    }}
                    className="px-3.5 py-2 bg-[#cf222e] text-white hover:bg-[#a61c24] rounded font-semibold cursor-pointer"
                  >
                    Confirm Reject
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Reports Review Modal */}
          {showReportsModal && reportsListing && (
            <div className="fixed inset-0 z-50 bg-[#24292f]/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-lg w-full max-w-md p-6 relative border border-[#d8dee4] shadow-lg text-xs space-y-4">
                <button
                  onClick={() => {
                    setShowReportsModal(false);
                    setReportsListing(null);
                  }}
                  className="absolute top-4 right-4 p-1 hover:bg-[#f6f8fa] border rounded-md"
                >
                  <X size={15} />
                </button>

                <h3 className="font-semibold text-sm text-[#cf222e] flex items-center gap-1">
                  <ShieldAlert size={16} />
                  Listing Reports History
                </h3>
                <p className="text-[#57606a]">The following complaints have been submitted against listing: <strong>{reportsListing.title}</strong></p>

                <div className="divide-y border rounded overflow-hidden max-h-56 overflow-y-auto">
                  {reportsListing.reports.map((rep, idx) => (
                    <div key={idx} className="p-3 bg-[#f6f8fa] space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold text-[#24292f]">
                        <span className="text-[#cf222e]">{rep.reason}</span>
                        <span className="text-[#57606a]">{new Date(rep.timestamp).toLocaleDateString()}</span>
                      </div>
                      {rep.comment && <p className="text-[#57606a] italic">"{rep.comment}"</p>}
                      <div className="text-[9px] text-[#57606a] font-mono">By: {rep.userEmail}</div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 justify-end pt-3 border-t">
                  <button
                    onClick={() => handleResolveReports(reportsListing._id, 'dismiss')}
                    className="px-3 py-2 bg-[#dafbe1] text-[#1a7f37] hover:bg-[#2da44e] hover:text-white border border-[#aef1b9] rounded font-semibold cursor-pointer"
                  >
                    Dismiss Reports
                  </button>
                  <button
                    onClick={() => handleResolveReports(reportsListing._id, 'remove')}
                    className="px-3 py-2 bg-[#ffebe9] text-[#cf222e] hover:bg-[#cf222e] hover:text-white border border-[#ffc1c0] rounded font-semibold cursor-pointer"
                  >
                    Suspend Listing
                  </button>
                  <button
                    onClick={() => {
                      setShowReportsModal(false);
                      setReportsListing(null);
                    }}
                    className="px-3 py-2 border rounded font-semibold hover:bg-[#f6f8fa]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
