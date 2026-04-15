<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class SeatCategory extends Model
{
    use HasUuids;

    protected $fillable = ['event_id', 'name', 'price'];
    public $incrementing = false;
    protected $keyType = 'string';

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function seats()
    {
        return $this->hasMany(Seat::class);
    }
}
