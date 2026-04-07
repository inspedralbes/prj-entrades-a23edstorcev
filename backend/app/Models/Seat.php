<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Seat extends Model
{
    use HasUuids;

    protected $fillable = [
        'seat_category_id', 'section', 'row', 'number', 'status', 'x', 'y', 'price'
    ];
    public $incrementing = false;
    protected $keyType = 'string';

    public function seatCategory()
    {
        return $this->belongsTo(SeatCategory::class);
    }

    public function sale()
    {
        return $this->hasOne(Sale::class);
    }
}
