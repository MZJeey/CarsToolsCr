<?php

use Psr\Log\LoggerInterface;
use Psr\Log\LogLevel;
class Logger implements LoggerInterface
{
    private $logpath;
    
    public function __construct() {
        $this->logpath=Config::get('LOG_PATH');
    }
    public function log($level, $message, array $context = []): void
    {
        // Current date in 1970-12-01 23:59:59 format
        $dateFormatted = (new \DateTime())->format('d-m-Y H:i:s');

        // Build the message with the current date, log level, 
        // and the string from the arguments
        
        $user=preg_replace('/\r\n|\r|\n/', '',shell_exec("echo %username%"));
        $message = sprintf(
            '[%s] [%s] %s: %s%s ',
            $dateFormatted,$user,
            $level,
            $message,
            PHP_EOL // Line break
        );
        $dateF = (new \DateTime())->format('d-m-Y');
        $logfilename = $this->logpath."/log-$dateF.log";
        file_put_contents($logfilename , $message, FILE_APPEND);
        
        
    }
    public function emergency($message, array $context = []): void
    {
        // Use the level from LogLevel class
        $this->log(LogLevel::EMERGENCY, $message, $context);
    }

    public function alert($message, array $context = []): void
    {
        $this->log(LogLevel::ALERT, $message, $context);
    }
    public function critical($message, array $context = []): void
    {
        // Use the level from LogLevel class
        $this->log(LogLevel::CRITICAL, $message, $context);
    }
    public function warning($message, array $context = []): void
    {
        // Use the level from LogLevel class
        $this->log(LogLevel::WARNING, $message, $context);
    }
    public function notice($message, array $context = []): void
    {
        // Use the level from LogLevel class
        $this->log(LogLevel::NOTICE, $message, $context);
    }
    public function info($message, array $context = []): void
    {
        // Use the level from LogLevel class
        $this->log(LogLevel::INFO, $message, $context);
    }
    public function debug($message, array $context = []): void
    {
        // Use the level from LogLevel class
        $this->log(LogLevel::DEBUG, $message, $context);
    }
    public function error($message, array $context = []): void
    {
        // Use the level from LogLevel class
        $this->log(LogLevel::ERROR, $message, $context);
    }
}
