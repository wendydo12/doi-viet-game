#!/usr/bin/env python3
"""Chạy JS trong tab Chrome thật của user qua AppleScript. Dùng: python3 chrome_js.py file.js"""
import subprocess, sys, json, pathlib

def run(js: str, timeout=120) -> str:
    script = '''
on run argv
  set theJS to item 1 of argv
  tell application "Google Chrome"
    set res to execute active tab of front window javascript theJS
    return res
  end tell
end run
'''
    p = subprocess.run(['osascript', '-', js], input=script, capture_output=True, text=True, timeout=timeout)
    if p.returncode != 0:
        return 'OSAERR: ' + p.stderr.strip()
    return p.stdout

if __name__ == '__main__':
    src = pathlib.Path(sys.argv[1]).read_text() if len(sys.argv) > 1 else sys.stdin.read()
    out = run(src)
    print(out)
    try:
        pathlib.Path(sys.argv[2]).write_text(out) if len(sys.argv) > 2 else None
    except Exception:
        pass
