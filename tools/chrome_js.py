#!/usr/bin/env python3
"""Chạy JS trong tab Chrome THẬT (tab meowa.ai đã đăng nhập) qua AppleScript.
Không cần tab active — tìm tab theo URL match.
Dùng: python3 chrome_js.py file.js [outfile]
"""
import subprocess, sys, pathlib

SCRIPT = '''
on run argv
  set theJS to item 1 of argv
  tell application "Google Chrome"
    repeat with w in windows
      repeat with t in tabs of w
        if URL of t contains "meowa.ai" then
          set res to execute t javascript theJS
          return res
        end if
      end repeat
    end repeat
    return "NOTAB_MEOWA"
  end tell
end run
'''

def run(js: str, timeout=180) -> str:
    p = subprocess.run(['osascript', '-', js], input=SCRIPT, capture_output=True, text=True, timeout=timeout)
    if p.returncode != 0:
        return 'OSAERR: ' + p.stderr.strip()
    return p.stdout

if __name__ == '__main__':
    src = pathlib.Path(sys.argv[1]).read_text()
    out = run(src)
    print(out)
    if len(sys.argv) > 2:
        pathlib.Path(sys.argv[2]).write_text(out)
