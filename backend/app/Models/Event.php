<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasUuids;

    protected $fillable = ['name', 'description', 'date', 'dates', 'location', 'image_path'];
    public $incrementing = false;
    protected $keyType = 'string';

    protected $casts = [
        'dates' => 'array',
    ];

    public function seatCategories()
    {
        return $this->hasMany(SeatCategory::class);
    }
}
