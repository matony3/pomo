class PomodoroTimer {
    constructor() {
        this.workTime = 25 * 60;
        this.breakTime = 5 * 60;
        this.longBreakTime = 15 * 60;
        this.currentTime = this.workTime;
        this.isRunning = false;
        this.isWorkSession = true;
        this.sessionCount = 0;
        this.intervalId = null;
        
        this.initElements();
        this.loadSettings();
        this.updateDisplay();
    }
    
    initElements() {
        this.timeDisplay = document.getElementById('timeDisplay');
        this.modeDisplay = document.getElementById('modeDisplay');
        this.sessionCountDisplay = document.getElementById('sessionCount');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.workTimeInput = document.getElementById('workTime');
        this.breakTimeInput = document.getElementById('breakTime');
        this.longBreakTimeInput = document.getElementById('longBreakTime');
        
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.workTimeInput.addEventListener('change', () => this.updateSettings());
        this.breakTimeInput.addEventListener('change', () => this.updateSettings());
        this.longBreakTimeInput.addEventListener('change', () => this.updateSettings());
    }
    
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.intervalId = setInterval(() => this.tick(), 1000);
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
        }
    }
    
    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            clearInterval(this.intervalId);
            this.startBtn.disabled = false;
            this.pauseBtn.disabled = true;
        }
    }
    
    reset() {
        this.pause();
        this.currentTime = this.isWorkSession ? this.workTime : this.getBreakTime();
        this.updateDisplay();
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
    }
    
    tick() {
        this.currentTime--;
        this.updateDisplay();
        
        if (this.currentTime <= 0) {
            this.completeSession();
        }
    }
    
    completeSession() {
        this.pause();
        
        if (this.isWorkSession) {
            this.sessionCount++;
            this.sessionCountDisplay.textContent = this.sessionCount;
        }
        
        this.isWorkSession = !this.isWorkSession;
        this.currentTime = this.isWorkSession ? this.workTime : this.getBreakTime();
        
        this.updateDisplay();
        this.playNotification();
        
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
    }
    
    getBreakTime() {
        return this.sessionCount % 4 === 0 && this.sessionCount > 0 ? 
               this.longBreakTime : this.breakTime;
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = this.currentTime % 60;
        this.timeDisplay.textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (this.isWorkSession) {
            this.modeDisplay.textContent = '作業時間';
            document.body.className = 'work-mode';
        } else {
            const isLongBreak = this.sessionCount % 4 === 0 && this.sessionCount > 0;
            this.modeDisplay.textContent = isLongBreak ? '長い休憩' : '短い休憩';
            document.body.className = 'break-mode';
        }
    }
    
    playNotification() {
        if ('Notification' in window && Notification.permission === 'granted') {
            const message = this.isWorkSession ? 
                           '作業時間を開始しましょう！' : 
                           '休憩時間です！';
            new Notification('ポモドーロタイマー', { body: message });
        }
    }
    
    loadSettings() {
        this.workTimeInput.value = this.workTime / 60;
        this.breakTimeInput.value = this.breakTime / 60;
        this.longBreakTimeInput.value = this.longBreakTime / 60;
    }
    
    updateSettings() {
        if (this.isRunning) return;
        
        this.workTime = parseInt(this.workTimeInput.value) * 60;
        this.breakTime = parseInt(this.breakTimeInput.value) * 60;
        this.longBreakTime = parseInt(this.longBreakTimeInput.value) * 60;
        
        this.currentTime = this.isWorkSession ? this.workTime : this.getBreakTime();
        this.updateDisplay();
    }
}

if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

const timer = new PomodoroTimer();