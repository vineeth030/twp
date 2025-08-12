<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkSchedule extends Model
{
    protected $casts = [
        'weekends' => 'array', // Laravel will auto-cast JSON to array
    ];

    protected $fillable = [
        'company_id','start_time','end_time', 'weekends'
    ];
}
