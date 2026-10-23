#!/usr/bin/env python3
"""Chạy JS trong tab Chrome THẬT có URL match bất kỳ qua AppleScript."""
import subprocess, sys, pathlib

def run(js: str, url_part: str, timeout=180) -> str:
    SCRIPT = '''
on run argv
  set theJS to item 1 of argv
  set theURL to item 2 of argv
  tell application "Google Chrome"
    repeat with w in windows
      repeat with t in tabs of w
        if URL of t contains theURL then
          set res to execute t javascript theJS
          return res
        end if
      end repeat
    end repeat
    return "NOTAB"
  end tell
end run
'''
    p = subprocess.run(['osascript', '-', js, url_part], input=SCRIPT, capture_output=True, text=True, timeout=timeout)
    if p.returncode != 0:
        return 'OSAERR: ' + p.stderr.strip()
    return p.stdout

if __name__ == '__main__':
    src = pathlib.Path(sys.argv[1]).read_text()
    print(run(src, sys.argv[2]))
