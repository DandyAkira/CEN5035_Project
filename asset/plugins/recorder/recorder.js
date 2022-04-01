(function (exports) {
    var Util = {
        init: function () {
            navigator.getUserMedia = navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia;

            window.AudioContext = window.AudioContext ||
                window.webkitAudioContext;
        },
        log: function () {
            console.log.apply(console, arguments);
        }
    };
    var Recorder = function (config) {

        var _this = this;
        config = config || {};
        config.sampleRate = config.sampleRate || 44100;
        config.bitRate = config.bitRate || 128;

        Util.init();

        if (navigator.getUserMedia) {
            navigator.getUserMedia({
                audio: true
            },
                function (stream) {
                    var context = new AudioContext(),
                        microphone = context.createMediaStreamSource(stream),
                        processor = context.createScriptProcessor(16384, 1, 1),
                        successCallback, errorCallback;

                    config.sampleRate = context.sampleRate;

                    processor.onaudioprocess = function (event) {
                        var array = event.inputBuffer.getChannelData(0);
                        realTimeWorker.postMessage({ cmd: 'encode', buf: array });
                    };

                    var realTimeWorker = new Worker('js/worker.js');
                    realTimeWorker.onmessage = function (e) {
                        switch (e.data.cmd) {
                            case 'init':
                                Util.log('Init success');
                                if (config.success) {
                                    config.success();
                                }
                                break;
                            case 'end':
                                if (successCallback) {
                                    var blob = new Blob(e.data.buf, { type: 'audio/mp3' });
                                    successCallback(blob);
                                    Util.log('The size of MP3 are：' + blob.size + '%cB', 'color:#0000EE');
                                }
                                break;
                            case 'error':
                                Util.log('Error message：' + e.data.error);
                                if (errorCallback) {
                                    errorCallback(e.data.error);
                                }
                                break;
                            default:
                                Util.log('Unknown message：' + e.data);
                        }
                    };
                    _this.start = function () {
                        if (processor && microphone) {
                            microphone.connect(processor);
                            processor.connect(context.destination);
                            Util.log('Start recording');
                        }
                    };
                    _this.stop = function () {
                        if (processor && microphone) {
                            microphone.disconnect();
                            processor.disconnect();
                            Util.log('End recording');
                        }
                    };
                    _this.getBlob = function (onSuccess, onError) {
                        successCallback = onSuccess;
                        errorCallback = onError;
                        realTimeWorker.postMessage({ cmd: 'finish' });
                    };

                    realTimeWorker.postMessage({
                        cmd: 'init',
                        config: {
                            sampleRate: config.sampleRate,
                            bitRate: config.bitRate
                        }
                    });
                },
                function (error) {
                    var msg;
                    switch (error.code || error.name) {
                        case 'PermissionDeniedError':
                        case 'PERMISSION_DENIED':
                        case 'NotAllowedError':
                            msg = 'Microphone permission denied!';
                            break;
                        case 'NOT_SUPPORTED_ERROR':
                        case 'NotSupportedError':
                            msg = 'Microphone unsupported!';
                            break;
                        case 'MANDATORY_UNSATISFIED_ERROR':
                        case 'MandatoryUnsatisfiedError':
                            msg = 'Can not find Microphone';
                            break;
                        default:
                            msg = 'Can not open microphone, error message:' + (error.code || error.name);
                            break;
                    }
                    Util.log(msg);
                    if (config.error) {
                        config.error(msg);
                    }
                });
        } else {
            Util.log('Recording unsupported');
            if (config.fix) {
                config.fix('Recording unsupported');
            }
        }

    };
    exports.Recorder = Recorder;
})(window);
