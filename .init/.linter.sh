#!/bin/bash
cd /home/kavia/workspace/code-generation/student-placement-automation-system-18571-18583/placement_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

