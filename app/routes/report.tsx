import { useState } from "react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { InfoIcon, ArrowRight, ExternalLink, FileBarChart, BarChart2 } from "lucide-react";

const ReportPage: React.FC = () => {
  const [fplId, setFplId] = useState<string>("");
  const [leagueId, setLeagueId] = useState<string>("");
  const [submittedFplId, setSubmittedFplId] = useState<boolean>(false);
  const [submittedLeagueId, setSubmittedLeagueId] = useState<boolean>(false);

  const handleFplIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate that ID is numeric
    if (fplId && /^\d+$/.test(fplId)) {
      setSubmittedFplId(true);
      // Here you would typically make an API call with the FPL ID
      console.log("Submitted FPL ID:", fplId);
    }
  };

  const handleLeagueIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate that ID is numeric
    if (leagueId && /^\d+$/.test(leagueId)) {
      setSubmittedLeagueId(true);
      // Here you would typically make an API call with the League ID
      console.log("Submitted League ID:", leagueId);
    }
  };

  const resetForm = (type: "fpl" | "league") => {
    if (type === "fpl") {
      setFplId("");
      setSubmittedFplId(false);
    } else {
      setLeagueId("");
      setSubmittedLeagueId(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 bg-white text-[#1a1a1a]">
      <div className="flex justify-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-[#1a1a1a]">
          <FileBarChart size={32} className="text-[#1a1a1a]" />
          Fantasy Premier League Reports
        </h1>
      </div>

      {/* Main content - styled with light theme */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6" style={{ height: "auto", maxWidth: "900px", margin: "0 auto 24px" }}>
        <h2 className="text-xl font-bold mb-4 text-[#1a1a1a]">GENERATE YOUR FPL REPORT</h2>

        <p className="text-center mb-6 text-[#666666]">
          Get detailed insights about your FPL team performance or analyze your entire league.
        </p>

        <Tabs defaultValue="fplId" className="mb-6">
          <TabsList className="w-full mb-6 bg-[#FFF9E5] border border-[#f0f0f0] rounded-lg overflow-hidden">
            <TabsTrigger
              value="fplId"
              className="w-1/2 text-[#333333] data-[state=active]:bg-[#FFEEB3] data-[state=active]:text-[#333333] data-[state=active]:font-semibold"
            >
              Manager Report
            </TabsTrigger>
            <TabsTrigger
              value="leagueId"
              className="w-1/2 text-[#777777] data-[state=active]:bg-[#FFEEB3] data-[state=active]:text-[#333333] data-[state=active]:font-semibold"
            >
              League Report
            </TabsTrigger>
          </TabsList>

          {/* FPL ID Tab */}
          <TabsContent value="fplId" className="mt-0">
            <div className="bg-[#272B3F] p-6 rounded-lg border border-[#353a52]">
              {!submittedFplId ? (
                <>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
                    <span className="text-[#ffc800]">•</span> Enter your FPL Manager ID
                  </h3>
                  <form onSubmit={handleFplIdSubmit}>
                    <div className="mb-6">
                      <label htmlFor="fplId" className="block mb-2 text-[#aeb2c8] font-medium">
                        FPL ID
                      </label>
                      <Input
                        id="fplId"
                        type="text"
                        value={fplId}
                        onChange={(e) => setFplId(e.target.value)}
                        placeholder="e.g., 1234567"
                        className="w-full bg-[#1e2235] border-[#4a4f66] focus:border-[#ffc800] text-white"
                        required
                        pattern="[0-9]+"
                        title="Please enter a valid numeric ID"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-[#505671] hover:bg-[#5b6382] text-white border-none transition-colors"
                      disabled={!fplId || !/^\d+$/.test(fplId)}
                    >
                      Generate Manager Report
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </>
              ) : (
                <div className="text-center py-4">
                  <BarChart2 size={48} className="text-[#ffc800] mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-4 text-white">Processing your report</h3>
                  <p className="mb-6 text-white">
                    We're generating a personalized report for FPL ID: <span className="font-bold text-[#ffc800]">{fplId}</span>
                  </p>
                  <p className="mb-6 text-[#aeb2c8]">
                    This might take a few moments. The report will include your season performance,
                    best players, transfer analysis, and more.
                  </p>
                  <Button
                    onClick={() => resetForm("fpl")}
                    className="bg-[#3a3f55] hover:bg-[#45495e] text-white border border-[#4a4f66] transition-colors"
                  >
                    Enter a different ID
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* League ID Tab */}
          <TabsContent value="leagueId" className="mt-0">
            <div className="bg-[#272B3F] p-6 rounded-lg border border-[#353a52]">
              {!submittedLeagueId ? (
                <>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
                    <span className="text-[#ffc800]">•</span> Enter your FPL League ID
                  </h3>
                  <form onSubmit={handleLeagueIdSubmit}>
                    <div className="mb-6">
                      <label htmlFor="leagueId" className="block mb-2 text-[#aeb2c8] font-medium">
                        League ID
                      </label>
                      <Input
                        id="leagueId"
                        type="text"
                        value={leagueId}
                        onChange={(e) => setLeagueId(e.target.value)}
                        placeholder="e.g., 123456"
                        className="w-full bg-[#1e2235] border-[#4a4f66] focus:border-[#ffc800] text-white"
                        required
                        pattern="[0-9]+"
                        title="Please enter a valid numeric ID"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-[#505671] hover:bg-[#5b6382] text-white border-none transition-colors"
                      disabled={!leagueId || !/^\d+$/.test(leagueId)}
                    >
                      Generate League Report
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </>
              ) : (
                <div className="text-center py-4">
                  <BarChart2 size={48} className="text-[#ffc800] mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-4 text-white">Processing your league report</h3>
                  <p className="mb-6 text-white">
                    We're generating a comprehensive report for League ID: <span className="font-bold text-[#ffc800]">{leagueId}</span>
                  </p>
                  <p className="mb-6 text-[#aeb2c8]">
                    This might take a few moments. The report will include league standings, manager comparisons,
                    popular player choices, and more.
                  </p>
                  <Button
                    onClick={() => resetForm("league")}
                    className="bg-[#3a3f55] hover:bg-[#45495e] text-white border border-[#4a4f66] transition-colors"
                  >
                    Enter a different league ID
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Guide Section - styled for light theme */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6" style={{ height: "auto", maxWidth: "900px", margin: "0 auto 24px" }}>
        <h2 className="text-xl font-bold mb-4 text-[#1a1a1a]">HOW TO FIND YOUR IDS</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4 text-[#ffc800] flex items-center gap-2 border-b border-[#f0f0f0] pb-2">
              <span className="w-6 h-6 rounded-full bg-[#ffc800] text-white flex items-center justify-center text-sm">1</span>
              Finding your FPL Manager ID
            </h3>
            <ol className="list-decimal pl-5 space-y-3 text-[#666666]">
              <li>Log in to the <a href="https://fantasy.premierleague.com/" target="_blank" rel="noopener noreferrer" className="text-[#ffc800] underline inline-flex items-center gap-1">Official FPL website <ExternalLink className="h-3 w-3" /></a></li>
              <li>Click on the "Points" tab</li>
              <li>Look at your browser's address bar, the URL will be something like:</li>
            </ol>
            <div className="bg-[#14171f] p-3 rounded-md my-3 font-mono text-sm text-[#aaaaaa] break-all">
              https://fantasy.premierleague.com/entry/<span className="text-[#ffc800] font-bold">1234567</span>/event/8
            </div>
            <p className="text-[#666666]">The highlighted number is your FPL Manager ID</p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-[#ffc800] flex items-center gap-2 border-b border-[#f0f0f0] pb-2">
              <span className="w-6 h-6 rounded-full bg-[#ffc800] text-white flex items-center justify-center text-sm">2</span>
              Finding your League ID
            </h3>
            <ol className="list-decimal pl-5 space-y-3 text-[#666666]">
              <li>Log in to the <a href="https://fantasy.premierleague.com/" target="_blank" rel="noopener noreferrer" className="text-[#ffc800] underline inline-flex items-center gap-1">Official FPL website <ExternalLink className="h-3 w-3" /></a></li>
              <li>Click on the "Leagues" tab</li>
              <li>Select the league you want to get a report for</li>
              <li>Look at your browser's address bar, the URL will be something like:</li>
            </ol>
            <div className="bg-[#14171f] p-3 rounded-md my-3 font-mono text-sm text-[#aaaaaa] break-all">
              https://fantasy.premierleague.com/leagues/<span className="text-[#ffc800] font-bold">123456</span>/standings/c
            </div>
            <p className="text-[#666666]">The highlighted number is your League ID</p>
          </div>
        </div>
      </div>

      {/* FAQ Section - styled for light theme */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6" style={{ height: "auto", maxWidth: "900px", margin: "0 auto 24px" }}>
        <h2 className="text-xl font-bold mb-4 text-[#1a1a1a]">FREQUENTLY ASKED QUESTIONS</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#272B3F] p-4 rounded-md border border-[#353a52] transition-all duration-200">
            <h4 className="font-semibold mb-2 text-[#ffc800]">What information will be in my report?</h4>
            <p className="text-[#dddddd]">
              Reports include season performance analysis, transfer history, captain choices, player ownership,
              and detailed statistics comparing your performance to others.
            </p>
          </div>

          <div className="bg-[#272B3F] p-4 rounded-md border border-[#353a52] transition-all duration-200">
            <h4 className="font-semibold mb-2 text-[#ffc800]">How often are reports updated?</h4>
            <p className="text-[#dddddd]">
              Reports are generated with the latest data after each gameweek is completed.
            </p>
          </div>

          <div className="bg-[#272B3F] p-4 rounded-md border border-[#353a52] transition-all duration-200">
            <h4 className="font-semibold mb-2 text-[#ffc800]">Can I see past seasons?</h4>
            <p className="text-[#dddddd]">
              Currently, reports are available for the 2024/25 and 2025/26 seasons.
            </p>
          </div>

          <div className="bg-[#272B3F] p-4 rounded-md border border-[#353a52] transition-all duration-200">
            <h4 className="font-semibold mb-2 text-[#ffc800]">How long does it take to generate a report?</h4>
            <p className="text-[#dddddd]">
              Most reports are generated within 15-30 seconds, depending on the amount of data being processed.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-8 mb-12">
        <Link to="/">
          <Button className="bg-[#505671] hover:bg-[#5b6382] text-white border-none transition-colors flex items-center gap-2">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ReportPage;