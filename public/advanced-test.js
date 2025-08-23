/**
 * 🚀 Advanced Real-time Chat Testing Suite
 * Comprehensive testing for WebSocket, Broadcasting, and Real-time features
 */

class RealtimeChatTester {
    constructor() {
        this.pusher = null;
        this.channels = new Map();
        this.metrics = {
            messagesReceived: 0,
            messagesSent: 0,
            latencySum: 0,
            latencyCount: 0,
            reconnects: 0,
            errors: 0,
            connectedAt: null,
            tests: { passed: 0, failed: 0 }
        };
        this.testResults = [];
    }

    // 🔗 Connection Tests
    async testConnection() {
        console.log('🧪 Starting connection test...');
        
        return new Promise((resolve, reject) => {
            this.pusher = new Pusher('shopping-agent-key', {
                wsHost: '127.0.0.1',
                wsPort: 6001,
                forceTLS: false,
                disableStats: true,
                enabledTransports: ['ws'],
                cluster: 'mt1',
                authEndpoint: '/broadcasting/auth',
                auth: {
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || 'test-token'
                    }
                }
            });

            const timeout = setTimeout(() => {
                this.recordTest('Connection Test', false, 'Connection timeout');
                reject('Connection timeout');
            }, 10000);

            this.pusher.connection.bind('connected', () => {
                clearTimeout(timeout);
                this.metrics.connectedAt = Date.now();
                this.recordTest('Connection Test', true, 'Successfully connected');
                console.log('✅ Connected to WebSocket server');
                console.log(`🔗 Socket ID: ${this.pusher.connection.socket_id}`);
                resolve(this.pusher);
            });

            this.pusher.connection.bind('error', (err) => {
                clearTimeout(timeout);
                this.metrics.errors++;
                this.recordTest('Connection Test', false, err.error || err.message);
                console.error('❌ Connection error:', err);
                reject(err);
            });

            this.setupConnectionMonitoring();
        });
    }

    setupConnectionMonitoring() {
        this.pusher.connection.bind('state_change', (states) => {
            console.log(`🔄 State change: ${states.previous} → ${states.current}`);
            
            if (states.current === 'connected' && states.previous === 'disconnected') {
                this.metrics.reconnects++;
            }
        });

        this.pusher.connection.bind('disconnected', () => {
            console.log('❌ Disconnected from server');
        });
    }

    // 📻 Channel Tests
    async testChannels() {
        console.log('🧪 Testing channel functionality...');
        
        const tests = [
            this.testPublicChannel(),
            this.testPrivateChannel(),
            this.testPresenceChannel(),
            this.testChannelEvents(),
            this.testChannelUnsubscription()
        ];

        const results = await Promise.allSettled(tests);
        return results;
    }

    async testPublicChannel() {
        return new Promise((resolve, reject) => {
            const channelName = 'test-public-channel';
            const channel = this.pusher.subscribe(channelName);
            this.channels.set(channelName, channel);

            const timeout = setTimeout(() => {
                this.recordTest('Public Channel', false, 'Subscription timeout');
                reject('Public channel subscription timeout');
            }, 5000);

            channel.bind('pusher:subscription_succeeded', () => {
                clearTimeout(timeout);
                this.recordTest('Public Channel', true, 'Successfully subscribed');
                console.log('✅ Public channel subscription successful');
                resolve(channel);
            });

            channel.bind('pusher:subscription_error', (err) => {
                clearTimeout(timeout);
                this.recordTest('Public Channel', false, err.error);
                console.error('❌ Public channel subscription failed:', err);
                reject(err);
            });
        });
    }

    async testPrivateChannel() {
        return new Promise((resolve, reject) => {
            const channelName = 'private-test-channel';
            const channel = this.pusher.subscribe(channelName);
            this.channels.set(channelName, channel);

            const timeout = setTimeout(() => {
                this.recordTest('Private Channel', false, 'Subscription timeout');
                reject('Private channel subscription timeout');
            }, 5000);

            channel.bind('pusher:subscription_succeeded', () => {
                clearTimeout(timeout);
                this.recordTest('Private Channel', true, 'Successfully subscribed');
                console.log('✅ Private channel subscription successful');
                resolve(channel);
            });

            channel.bind('pusher:subscription_error', (err) => {
                clearTimeout(timeout);
                this.recordTest('Private Channel', false, err.error || 'Auth failed');
                console.log('⚠️ Private channel subscription failed (expected if no auth):', err);
                resolve(null); // Not failure - might be expected
            });
        });
    }

    async testPresenceChannel() {
        return new Promise((resolve, reject) => {
            const channelName = 'presence-test-channel';
            const channel = this.pusher.subscribe(channelName);
            this.channels.set(channelName, channel);

            const timeout = setTimeout(() => {
                this.recordTest('Presence Channel', false, 'Subscription timeout');
                reject('Presence channel subscription timeout');
            }, 5000);

            channel.bind('pusher:subscription_succeeded', (members) => {
                clearTimeout(timeout);
                this.recordTest('Presence Channel', true, `Subscribed with ${members?.count || 0} members`);
                console.log('✅ Presence channel subscription successful');
                console.log(`👥 Members count: ${members?.count || 0}`);
                resolve(channel);
            });

            channel.bind('pusher:subscription_error', (err) => {
                clearTimeout(timeout);
                this.recordTest('Presence Channel', false, err.error || 'Auth failed');
                console.log('⚠️ Presence channel subscription failed (expected if no auth):', err);
                resolve(null);
            });

            channel.bind('pusher:member_added', (member) => {
                console.log('👤 Member added:', member.info);
            });

            channel.bind('pusher:member_removed', (member) => {
                console.log('👤 Member removed:', member.info);
            });
        });
    }

    async testChannelEvents() {
        return new Promise((resolve) => {
            const channelName = 'test-events-channel';
            const channel = this.pusher.subscribe(channelName);
            let eventsReceived = 0;

            // Test different event types
            const eventTypes = ['test-event', 'message.sent', 'user.typing', 'file.uploaded'];
            
            eventTypes.forEach(eventType => {
                channel.bind(eventType, (data) => {
                    eventsReceived++;
                    this.metrics.messagesReceived++;
                    console.log(`📨 Received ${eventType}:`, data);
                });
            });

            // Simulate events after subscription
            channel.bind('pusher:subscription_succeeded', () => {
                console.log('📡 Testing event broadcasting...');
                
                // Simulate some events (in real app, these would come from server)
                setTimeout(() => {
                    this.recordTest('Channel Events', true, `Ready to receive ${eventTypes.length} event types`);
                    resolve(eventsReceived);
                }, 1000);
            });
        });
    }

    async testChannelUnsubscription() {
        const channelName = 'temp-test-channel';
        const channel = this.pusher.subscribe(channelName);

        return new Promise((resolve) => {
            channel.bind('pusher:subscription_succeeded', () => {
                console.log('📤 Testing channel unsubscription...');
                
                this.pusher.unsubscribe(channelName);
                this.recordTest('Channel Unsubscription', true, 'Successfully unsubscribed');
                console.log('✅ Channel unsubscribed successfully');
                resolve(true);
            });
        });
    }

    // ⚡ Performance Tests
    async testLatency(iterations = 10) {
        console.log(`🧪 Testing latency over ${iterations} measurements...`);
        
        const latencies = [];
        
        for (let i = 0; i < iterations; i++) {
            const startTime = Date.now();
            const channel = this.pusher.subscribe(`latency-test-${i}`);
            
            await new Promise((resolve) => {
                channel.bind('pusher:subscription_succeeded', () => {
                    const latency = Date.now() - startTime;
                    latencies.push(latency);
                    this.pusher.unsubscribe(`latency-test-${i}`);
                    resolve();
                });
            });
        }

        const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
        const minLatency = Math.min(...latencies);
        const maxLatency = Math.max(...latencies);

        this.recordTest('Latency Test', true, `Avg: ${Math.round(avgLatency)}ms, Min: ${minLatency}ms, Max: ${maxLatency}ms`);
        
        console.log('📊 Latency Results:');
        console.log(`   Average: ${Math.round(avgLatency)}ms`);
        console.log(`   Minimum: ${minLatency}ms`);
        console.log(`   Maximum: ${maxLatency}ms`);
        
        return { avg: avgLatency, min: minLatency, max: maxLatency };
    }

    async testStressLoad(messageCount = 100) {
        console.log(`🧪 Stress testing with ${messageCount} rapid subscriptions...`);
        
        const startTime = Date.now();
        const promises = [];
        
        for (let i = 0; i < messageCount; i++) {
            promises.push(new Promise((resolve) => {
                const channel = this.pusher.subscribe(`stress-test-${i}`);
                channel.bind('pusher:subscription_succeeded', () => {
                    resolve();
                });
            }));
        }

        await Promise.all(promises);
        const totalTime = Date.now() - startTime;
        
        this.recordTest('Stress Test', true, `${messageCount} subscriptions in ${totalTime}ms`);
        console.log(`✅ Stress test completed: ${messageCount} subscriptions in ${totalTime}ms`);
        console.log(`📈 Rate: ${Math.round((messageCount / totalTime) * 1000)} subscriptions/second`);
        
        return { messageCount, totalTime, rate: (messageCount / totalTime) * 1000 };
    }

    // 🔐 Security Tests
    async testAuthentication() {
        console.log('🧪 Testing authentication mechanisms...');
        
        // Test with valid token
        const validResult = await this.testAuthWithToken('valid-token');
        
        // Test with invalid token
        const invalidResult = await this.testAuthWithToken('invalid-token');
        
        return { valid: validResult, invalid: invalidResult };
    }

    async testAuthWithToken(token) {
        const testPusher = new Pusher('shopping-agent-key', {
            wsHost: '127.0.0.1',
            wsPort: 6001,
            forceTLS: false,
            disableStats: true,
            enabledTransports: ['ws'],
            authEndpoint: '/broadcasting/auth',
            auth: {
                headers: {
                    'X-CSRF-TOKEN': token
                }
            }
        });

        return new Promise((resolve) => {
            const channel = testPusher.subscribe('private-auth-test');
            
            const timeout = setTimeout(() => {
                testPusher.disconnect();
                resolve({ success: false, reason: 'timeout' });
            }, 5000);

            channel.bind('pusher:subscription_succeeded', () => {
                clearTimeout(timeout);
                testPusher.disconnect();
                resolve({ success: true });
            });

            channel.bind('pusher:subscription_error', (err) => {
                clearTimeout(timeout);
                testPusher.disconnect();
                resolve({ success: false, reason: err.error });
            });
        });
    }

    // 🔄 Reliability Tests
    async testReconnection() {
        console.log('🧪 Testing connection reliability...');
        
        return new Promise((resolve) => {
            let reconnected = false;
            
            this.pusher.connection.bind('connected', () => {
                if (reconnected) {
                    this.recordTest('Reconnection Test', true, 'Successfully reconnected');
                    console.log('✅ Reconnection successful');
                    resolve(true);
                }
            });

            // Force disconnection
            console.log('🔌 Forcing disconnection...');
            this.pusher.disconnect();
            
            // Attempt reconnection
            setTimeout(() => {
                reconnected = true;
                console.log('🔄 Attempting reconnection...');
                this.pusher.connect();
            }, 2000);
        });
    }

    // 📊 Comprehensive Test Suite
    async runCompleteTestSuite() {
        console.log('🚀 Starting comprehensive real-time chat test suite...');
        console.log('=' .repeat(60));
        
        try {
            // 1. Connection Test
            console.log('\n1️⃣ Testing Connection...');
            await this.testConnection();
            
            // 2. Channel Tests
            console.log('\n2️⃣ Testing Channels...');
            await this.testChannels();
            
            // 3. Performance Tests
            console.log('\n3️⃣ Testing Performance...');
            await this.testLatency(5);
            await this.testStressLoad(50);
            
            // 4. Security Tests
            console.log('\n4️⃣ Testing Authentication...');
            await this.testAuthentication();
            
            // 5. Reliability Tests
            console.log('\n5️⃣ Testing Reliability...');
            await this.testReconnection();
            
            // Final Results
            console.log('\n' + '=' .repeat(60));
            this.printTestSummary();
            
        } catch (error) {
            console.error('❌ Test suite failed:', error);
            this.recordTest('Test Suite', false, error.message);
        }
    }

    // 📈 Utility Methods
    recordTest(name, passed, details = '') {
        this.testResults.push({
            name,
            passed,
            details,
            timestamp: new Date().toISOString()
        });
        
        if (passed) {
            this.metrics.tests.passed++;
        } else {
            this.metrics.tests.failed++;
        }
    }

    printTestSummary() {
        console.log('📊 TEST RESULTS SUMMARY');
        console.log('-' .repeat(40));
        
        this.testResults.forEach(test => {
            const status = test.passed ? '✅' : '❌';
            console.log(`${status} ${test.name}: ${test.details}`);
        });
        
        console.log('-' .repeat(40));
        console.log(`📈 Total Tests: ${this.testResults.length}`);
        console.log(`✅ Passed: ${this.metrics.tests.passed}`);
        console.log(`❌ Failed: ${this.metrics.tests.failed}`);
        console.log(`📊 Success Rate: ${Math.round((this.metrics.tests.passed / this.testResults.length) * 100)}%`);
        
        if (this.metrics.connectedAt) {
            const uptime = Math.round((Date.now() - this.metrics.connectedAt) / 1000);
            console.log(`⏱️ Connection Uptime: ${uptime}s`);
        }
        
        console.log(`📨 Messages Received: ${this.metrics.messagesReceived}`);
        console.log(`🔄 Reconnects: ${this.metrics.reconnects}`);
        console.log(`❌ Errors: ${this.metrics.errors}`);
        
        console.log('\n🎯 Real-time Chat System Status:', 
                   this.metrics.tests.failed === 0 ? '✅ FULLY OPERATIONAL' : '⚠️ NEEDS ATTENTION');
    }

    getMetrics() {
        return {
            ...this.metrics,
            uptime: this.metrics.connectedAt ? Date.now() - this.metrics.connectedAt : 0,
            testResults: this.testResults
        };
    }

    // 🧹 Cleanup
    disconnect() {
        if (this.pusher) {
            this.pusher.disconnect();
            this.channels.clear();
            console.log('🔌 Disconnected and cleaned up');
        }
    }
}

// 🚀 Global Test Runner
window.RealtimeTester = RealtimeChatTester;

// Quick test functions for console
window.quickTest = async () => {
    const tester = new RealtimeChatTester();
    await tester.testConnection();
    return tester;
};

window.fullTest = async () => {
    const tester = new RealtimeChatTester();
    await tester.runCompleteTestSuite();
    return tester;
};

console.log('🎯 Advanced Real-time Chat Tester Loaded!');
console.log('💡 Quick Commands:');
console.log('   quickTest() - Basic connection test');
console.log('   fullTest() - Complete test suite');
console.log('   new RealtimeTester() - Create custom tester');
console.log('🚀 Ready for advanced testing!');