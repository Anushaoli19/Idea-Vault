export default function Footer({ onNavigate }: { onNavigate: (tab: string) => void }) {
  return (
    <footer className="mt-16 bg-surface-container-lowest border-t border-surface-container py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary-container flex items-center justify-center text-on-primary font-bold">
                <span className="material-symbols-outlined text-[18px]">lightbulb</span>
              </div>
              <span className="font-bold text-on-surface">NIE Idea Vault</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              The official capstone project registry and interdisciplinary innovation hub of The National Institute of Engineering (NIE), Mysuru.
            </p>
            <div className="text-xs text-on-surface-variant font-medium">
              Autonomous Institute under VTU, Belagavi
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-on-surface uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-1.5 text-xs text-on-surface-variant">
              <li>
                <button onClick={() => onNavigate('explore')} className="hover:text-primary transition-colors">
                  Explore Project Ideas
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('post')} className="hover:text-primary transition-colors">
                  Submit Capstone Proposal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('teammates')} className="hover:text-primary transition-colors">
                  Teammate Recruitment Hub
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('leaderboard')} className="hover:text-primary transition-colors">
                  Campus Leaderboard
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-on-surface uppercase tracking-wider">Governance & Ethics</h4>
            <ul className="space-y-1.5 text-xs text-on-surface-variant">
              <li>
                <button onClick={() => onNavigate('settings')} className="hover:text-primary transition-colors">
                  NIE IP & Patent Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('settings')} className="hover:text-primary transition-colors">
                  Faculty Mentor Guidelines
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('settings')} className="hover:text-primary transition-colors">
                  Duplicate Mitigation Protocol
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('settings')} className="hover:text-primary transition-colors">
                  Hardware Testbed Safety
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-on-surface uppercase tracking-wider">Campus Division</h4>
            <div className="text-xs text-on-surface-variant space-y-1">
              <div><strong>South Campus:</strong> Manandavadi Road, Mysuru - 570008</div>
              <div><strong>North Campus:</strong> Hootagalli Industrial Area, Mysuru - 570018</div>
              <div className="pt-2 text-primary font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">school</span>
                <span>Research & Development Cell</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-surface-container flex flex-col sm:flex-row items-center justify-between text-xs text-on-surface-variant gap-3">
          <div>
            © {new Date().getFullYear()} The National Institute of Engineering, Mysuru. All Rights Reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:underline cursor-pointer" onClick={() => onNavigate('settings')}>Privacy Policy</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer" onClick={() => onNavigate('settings')}>Academic Honor Code</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer" onClick={() => onNavigate('settings')}>Security & SSO</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
