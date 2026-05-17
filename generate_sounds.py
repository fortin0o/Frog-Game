import wave
import math
import struct
import os

os.makedirs('assets', exist_ok=True)

def generate_tone(filename, duration_ms, start_freq, end_freq, volume=0.5):
    sample_rate = 44100
    num_samples = int(sample_rate * (duration_ms / 1000.0))
    
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        
        for i in range(num_samples):
            t = float(i) / sample_rate
            # Linear frequency sweep
            current_freq = start_freq + (end_freq - start_freq) * (i / num_samples)
            
            # Simple square wave for retro feel
            value = math.sin(2.0 * math.pi * current_freq * t)
            if value > 0:
                value = 1.0
            else:
                value = -1.0
                
            # Envelope (fade out)
            envelope = 1.0 - (i / num_samples)
            
            # Pack value
            packed_value = struct.pack('h', int(value * envelope * volume * 32767.0))
            wav_file.writeframes(packed_value)

import random

def generate_flap(filename, duration_ms, volume=0.5):
    sample_rate = 44100
    num_samples = int(sample_rate * (duration_ms / 1000.0))
    
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        
        for i in range(num_samples):
            # Noise
            noise = random.uniform(-1.0, 1.0)
            
            # Low frequency for the "whoosh" of a wing
            t = float(i) / sample_rate
            sine = math.sin(2.0 * math.pi * 60 * t)
            
            value = noise * 0.4 + sine * 0.6
            
            # Attack and Decay envelope
            attack_samples = int(num_samples * 0.2)
            if i < attack_samples:
                envelope = i / attack_samples
            else:
                envelope = 1.0 - ((i - attack_samples) / (num_samples - attack_samples))
            
            packed_value = struct.pack('h', int(value * envelope * volume * 32767.0))
            wav_file.writeframes(packed_value)

# Jump: wing flap
generate_flap('assets/jump.wav', 250, volume=0.15)

# Game Over: descending sweep, lowered volume
generate_tone('assets/gameover.wav', 800, 300, 100, volume=0.2)

def generate_bg_music(filename):
    sample_rate = 44100
    duration_ms = 4000 # 4 seconds loop
    num_samples = int(sample_rate * (duration_ms / 1000.0))
    
    # Simple retro melody
    notes = [440, 440, 587, 659, 587, 440, 392, 440]
    note_duration = num_samples // len(notes)
    
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        
        for i in range(num_samples):
            note_idx = i // note_duration
            freq = notes[note_idx]
            
            t = float(i % note_duration) / sample_rate
            
            # Triangle wave for softer background
            value = 2.0 * abs(2.0 * (t * freq - math.floor(t * freq + 0.5))) - 1.0
            
            # Volume and slight envelope per note (lowered overall volume)
            env = 1.0 - (float(i % note_duration) / note_duration) * 0.5
            
            packed_value = struct.pack('h', int(value * 0.04 * env * 32767.0))
            wav_file.writeframes(packed_value)

def generate_coin(filename):
    sample_rate = 44100
    duration_ms = 150
    num_samples = int(sample_rate * (duration_ms / 1000.0))
    
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        
        for i in range(num_samples):
            t = float(i) / sample_rate
            # High-pitched ding, frequency jumps halfway through
            freq = 987.77 if i < num_samples / 2 else 1318.51 # B5 to E6
            
            # Sine wave
            value = math.sin(2.0 * math.pi * freq * t)
            
            # Envelope (quick attack, then decay)
            envelope = 1.0 - (i / num_samples)
            
            packed_value = struct.pack('h', int(value * envelope * 0.3 * 32767.0))
            wav_file.writeframes(packed_value)

def generate_score(filename):
    sample_rate = 44100
    duration_ms = 100
    num_samples = int(sample_rate * (duration_ms / 1000.0))
    
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        
        for i in range(num_samples):
            t = float(i) / sample_rate
            # Simple mid-pitch ding (E5)
            freq = 659.25
            
            value = math.sin(2.0 * math.pi * freq * t)
            envelope = 1.0 - (i / num_samples)
            
            packed_value = struct.pack('h', int(value * envelope * 0.2 * 32767.0))
            wav_file.writeframes(packed_value)

generate_bg_music('assets/bgmusic.wav')
generate_coin('assets/coin.wav')
generate_score('assets/score.wav')
print("Sounds generated successfully.")
